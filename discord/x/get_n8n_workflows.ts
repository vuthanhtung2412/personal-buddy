import { N8N_API_URL } from "@/const";
import { GetN8NAPIKey } from "@/config";

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

type DiscordCommandFromN8n = {
  inputForm: {
    name: string;
    type: 'number' | 'boolean' | 'string'
  }[]
  webhookPath: string;
}

/**
 * NOT TYPE SAFE
 */
export async function getAllWorkflows() {
  const res: DiscordCommandFromN8n[] = []
  try {
    // Filter active workflows with "discord" tag
    const params = new URLSearchParams({ active: "true", tags: "discord" });
    const response = await fetch(
      `${N8N_API_URL}/api/v1/workflows?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "X-N8N-API-KEY": GetN8NAPIKey(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.statusText}`);
    }

    const result = (await response.json()) as { data: Object[] };
    const workflows = result.data as WorkflowData[];

    for (const workflow of workflows) {
      console.log(`Workflow ID: ${workflow.id}`);
      console.log(`Name: ${workflow.name}`);

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

      // log webhook and sub-workflow trigger node details
      if (webhookNode && 'parameters' in webhookNode) {
        console.log("Webhook path:", webhookNode?.parameters.path);
      }

      console.log("Input form", workflowTriggerNode?.
        parameters.
        workflowInputs.
        values
      );

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
      const wfInputs = workflowTriggerNode.parameters.workflowInputs.values;

      const ensureType = (input: {
        name: string;
        type?: 'number' | 'boolean' | 'string'
      }): {
        name: string;
        type: 'number' | 'boolean' | 'string'
      } => ({
        name: input.name,
        type: input.type || 'string'
      })

      const inputForm = (wfInputs as {
        name: string;
        type?: 'number' | 'boolean' | 'string'
      }[]).map(ensureType)

      res.push({
        webhookPath,
        inputForm
      })

      console.log("-----");
    }
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
  return res
}

getAllWorkflows();
