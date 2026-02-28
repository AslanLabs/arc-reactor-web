export const queryKeys = {
  approval: {
    all: () => ['approval'] as const,
    list: () => ['approval', 'list'] as const,
  },
  errorReports: {
    all: () => ['errorReports'] as const,
    list: () => ['errorReports', 'list'] as const,
  },
}
