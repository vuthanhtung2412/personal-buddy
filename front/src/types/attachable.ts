export type Workflow = {
  id: string,
}

export type Resource = {
  id: string,
  subtype:
  | "facebook"
  | "github"
  | "notion"
  | "slack"
  | "discord"
  | "google_doc"
  | "google_sheet"
  | "google_drive"
  | "google_calendar"
}

export type Attachable = ({ type: "resource" } & Resource) | ({ type: "workflow" } & Workflow)

