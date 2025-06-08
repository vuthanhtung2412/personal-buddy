import { N8N_API_URL } from "@/const";
import { GetN8NAPIKey } from "@/config";

interface WorkflowData {
  id: string;
  name: string;
  active: boolean;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: Record<string, any>;
  }>;
  connections: Record<string, any>;
  tags: string[];
}

export async function getAllWorkflows() {
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
      const webhookNodes = workflow.nodes.filter(
        (node) => node.name === "Webhook"
      );
      console.log("Webhook path:", webhookNodes[0]?.parameters.path);

      console.log("-----");
    }
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
}

getAllWorkflows();
