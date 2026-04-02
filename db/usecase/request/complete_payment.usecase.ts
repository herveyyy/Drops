import { db } from "@/db";
import { requests } from "@/db/schema/requests";
import { eq } from "drizzle-orm";

export class CompletePaymentUseCase {
  private db = db;

  async execute(requestIds: number[], operatorName: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const auditEntry = JSON.stringify({
        action: "payment_completed",
        operator: operatorName,
        timestamp: now,
      });

      for (const id of requestIds) {
        // Get current auditLog
        const current = await this.db
          .select({ auditLog: requests.auditLog })
          .from(requests)
          .where(eq(requests.id, id))
          .limit(1);

        const existingLog = current[0]?.auditLog
          ? JSON.parse(current[0].auditLog)
          : [];
        existingLog.push(JSON.parse(auditEntry));

        await this.db
          .update(requests)
          .set({
            status: "completed",
            auditLog: JSON.stringify(existingLog),
            updatedAt: now,
          })
          .where(eq(requests.id, id));
      }
    } catch (error) {
      throw new Error("Failed to complete payment");
    }
  }
}
