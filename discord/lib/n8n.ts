import { DiscordCommand } from '@/types/types';
import { N8N_API_URL } from "@/const";
import { GetEnv, GetN8NAPIKey } from "@/config";
import {
  Interaction,
  SlashCommandBuilder,
  MessageFlags
} from 'discord.js';
import { tryCatch } from '@/lib/try_catch';

interface WorkflowData {
  id: string;
  name: string;
  nodes: Array<N8nNode>;
}

type N8nNode = {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  parameters: Record<string, any>;
}

export async function getCommandsFromN8n() {
  const res: DiscordCommand[] = []
  const params = new URLSearchParams({ active: "true", tags: "discord" });

  const n8nWorkflowsRes = await tryCatch(
    fetch(
      `${N8N_API_URL}/api/v1/workflows?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "X-N8N-API-KEY": GetN8NAPIKey(),
          "Content-Type": "application/json",
        },
      }
    )
  )

  if (n8nWorkflowsRes.isErr()) {
    throw new Error(`Failed to fetch workflows: ${n8nWorkflowsRes.error}`);
  }

  if (!n8nWorkflowsRes.value.ok) {
    throw new Error(`Failed to fetch workflows: ${n8nWorkflowsRes.value.text()}`);
  }

  const workflows = (
    (await n8nWorkflowsRes.value.json()) as {
      data: WorkflowData[]
    }).
    data;

  const wfNameSet = new Set<string>();

  for (const workflow of workflows) {

    if (wfNameSet.has(workflow.name)) {
      throw Error(`Duplicate workflow name:  ${workflow.name}`)
    }
    // Find webhook nodes
    let webhookNode = null
    let workflowTriggerNode = null
    for (const n of workflow.nodes) {
      if (n.type === "n8n-nodes-base.webhook") {
        if (webhookNode) {
          console.warn(`Multiple webhook nodes found in workflow ${workflow.name}`);
          continue
        }
        webhookNode = n;
      }
      if (n.type === "n8n-nodes-base.executeWorkflowTrigger") {
        if (workflowTriggerNode) {
          console.warn(`Multiple sub-wf trigger nodes found in workflow ${workflow.name}`);
          continue
        }
        workflowTriggerNode = n;
      }
    }

    // Parse workflow trigger node inputs and webhook path
    if (!webhookNode?.parameters.path) {
      console.error(`No webhook node found in workflow ${workflow.name}. Skipped`);
      continue;
    }
    if (!workflowTriggerNode?.parameters.workflowInputs.values) {
      console.error(`No sub-wf trigger node found in workflow ${workflow.name}. Skipped`);
      continue;
    }

    const webhookPath = webhookNode.parameters.path as string;
    const inputForm = workflowTriggerNode.parameters.workflowInputs.values as {
      name: string;
      type?: 'number' | 'boolean'
    }[]

    const handler = webhookHandler(webhookPath)
    const data = new SlashCommandBuilder().
      setName(workflow.name).
      setDescription("None")

    for (const field of inputForm) {
      switch (field.type) {
        case 'number':
          data.addIntegerOption(option => option
            .setDescription("None")
            .setName(field.name)
            .setRequired(true)
          )
          break
        case 'boolean':
          data.addBooleanOption(option => option
            .setDescription("None")
            .setName(field.name)
            .setRequired(true)
          )
          break
        default:
          data.addStringOption(option => option
            .setDescription("None")
            .setName(field.name)
            .setRequired(true)
          )
      }
    }

    res.push({
      data,
      handler,
    })
  }
  return res
}

function webhookHandler(webhookPath: string) {
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const webhookUrl = `${N8N_API_URL}/` +
      `${GetEnv() === "production" ? "webhook" : "webhook-test"}/` +
      `${webhookPath}`;

    const res = await tryCatch(
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": GetN8NAPIKey(),
          "Content-Type": "application/json",
          body: JSON.stringify({
            ...interaction.toJSON() as Object,
            token: interaction.token,
            options: interaction.options.data
          }, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        },
      })
    );

    if (res.isErr()) {
      await interaction.deleteReply();
      await interaction.followUp({
        content: `Unexpected error while execute workflows \n ${res.error}`,
        flags: MessageFlags.Ephemeral
      })
      console.error(res.error)
      return
    }


    if (!res.value.ok) {
      const errorMessage = `Workflow failed:\n` +
        `\`\`\`json\n` +
        `${JSON.stringify(await res.value.json(), null, 2)}\n` +
        `\`\`\``
      console.error("[ERROR] " + errorMessage);
      interaction.editReply(errorMessage);
      return
    }

    const successMessage = `Workflow executed successfully! Output: \n` +
      `\`\`\`json\n` +
      `${JSON.stringify(await res.value.json(), null, 2)}\n` +
      `\`\`\``

    console.log(`[INFO] ` + successMessage);

    interaction.editReply(successMessage);
  };
}
