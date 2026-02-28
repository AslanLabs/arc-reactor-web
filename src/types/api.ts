export interface ChatRequest {
  message: string
  model?: string
  systemPrompt?: string
  personaId?: string
  userId?: string
  metadata?: Record<string, unknown>
  responseFormat?: 'TEXT' | 'JSON'
  responseSchema?: string
}

export interface ChatResponse {
  content: string | null
  success: boolean
  model?: string
  toolsUsed: string[]
  errorMessage?: string
}

export interface PersonaResponse {
  id: string
  name: string
  systemPrompt: string
  isDefault: boolean
  createdAt: number
  updatedAt: number
}

// ---- Error Report Types ----

export interface ErrorReportRequest {
  stackTrace: string
  serviceName: string
  repoSlug: string
  slackChannel: string
  environment?: string
}

export interface ErrorReportResponse {
  accepted: boolean
  requestId: string
}

// ---- Approval Types (Human-in-the-Loop) ----

export interface ApprovalSummary {
  id: string
  runId: string
  userId: string
  toolName: string
  arguments: Record<string, unknown>
  requestedAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'TIMED_OUT'
}

export interface ApprovalActionResponse {
  success: boolean
  message: string
}
