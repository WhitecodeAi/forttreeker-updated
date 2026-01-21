import {
  TrekPlan,
  TrekPlanSummary,
  EnrichedTrekPlan,
  TrekPlansResponse,
  TrekPlanResponse,
  TrekPlanCreateResponse,
  TrekPlanStatsResponse,
  TrekPlanPDFResponse,
  ShareURLResponse,
  CreateTrekPlanRequest,
  UpdateTrekPlanRequest,
  TrekPlansQueryParams,
  TREK_PLAN_API_ENDPOINTS,
  GearItem,
  TrekPlanPDFData,
} from "@shared/trek-plan-api";

class TrekPlanAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "";
  }

  private async fetchAPI<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Non-JSON response received:",
          text.substring(0, 200) + "...",
        );
        throw new Error(
          "Server returned non-JSON response. Please check server configuration.",
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      if (
        error instanceof SyntaxError &&
        error.message.includes("Unexpected token")
      ) {
        console.error(
          "JSON parsing error - likely received HTML instead of JSON",
        );
        throw new Error(
          "API connection error: Server returned HTML instead of JSON. Please refresh the page.",
        );
      }
      console.error("Trek Plan API Error:", error);
      throw error;
    }
  }

  // Get all trek plans with optional filtering and pagination
  async getTrekPlans(
    params?: TrekPlansQueryParams,
  ): Promise<TrekPlansResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `${TREK_PLAN_API_ENDPOINTS.TREK_PLANS}?${queryString}`
      : TREK_PLAN_API_ENDPOINTS.TREK_PLANS;

    return this.fetchAPI<TrekPlansResponse>(url);
  }

  // Get single trek plan by ID
  async getTrekPlanById(id: string): Promise<TrekPlanResponse> {
    return this.fetchAPI<TrekPlanResponse>(
      TREK_PLAN_API_ENDPOINTS.TREK_PLAN_BY_ID(id),
    );
  }

  // Create new trek plan
  async createTrekPlan(
    planData: CreateTrekPlanRequest,
  ): Promise<TrekPlanCreateResponse> {
    return this.fetchAPI<TrekPlanCreateResponse>(
      TREK_PLAN_API_ENDPOINTS.TREK_PLANS,
      {
        method: "POST",
        body: JSON.stringify(planData),
      },
    );
  }

  // Update trek plan
  async updateTrekPlan(
    id: string,
    planData: UpdateTrekPlanRequest,
  ): Promise<TrekPlanResponse> {
    return this.fetchAPI<TrekPlanResponse>(
      TREK_PLAN_API_ENDPOINTS.TREK_PLAN_BY_ID(id),
      {
        method: "PUT",
        body: JSON.stringify(planData),
      },
    );
  }

  // Delete trek plan
  async deleteTrekPlan(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI<{ success: boolean; message: string }>(
      TREK_PLAN_API_ENDPOINTS.TREK_PLAN_BY_ID(id),
      { method: "DELETE" },
    );
  }

  // Duplicate trek plan
  async duplicateTrekPlan(id: string): Promise<TrekPlanCreateResponse> {
    return this.fetchAPI<TrekPlanCreateResponse>(
      TREK_PLAN_API_ENDPOINTS.DUPLICATE_TREK_PLAN(id),
      { method: "POST" },
    );
  }

  // Update gear checklist
  async updateGearChecklist(
    id: string,
    gearChecklist: GearItem[],
  ): Promise<TrekPlanResponse> {
    return this.fetchAPI<TrekPlanResponse>(
      TREK_PLAN_API_ENDPOINTS.UPDATE_GEAR(id),
      {
        method: "PATCH",
        body: JSON.stringify({ gearChecklist }),
      },
    );
  }

  // Get trek plan statistics
  async getTrekPlanStats(): Promise<TrekPlanStatsResponse> {
    return this.fetchAPI<TrekPlanStatsResponse>(
      TREK_PLAN_API_ENDPOINTS.TREK_PLAN_STATS,
    );
  }

  // Get PDF data for trek plan
  async getTrekPlanPDFData(id: string): Promise<TrekPlanPDFResponse> {
    return this.fetchAPI<TrekPlanPDFResponse>(
      TREK_PLAN_API_ENDPOINTS.PDF_DATA(id),
    );
  }

  // Trigger PDF download
  async downloadTrekPlanPDF(
    id: string,
  ): Promise<{ success: boolean; message: string; filename: string }> {
    return this.fetchAPI<{
      success: boolean;
      message: string;
      filename: string;
    }>(TREK_PLAN_API_ENDPOINTS.PDF_DOWNLOAD(id), { method: "POST" });
  }

  // Get shareable URL for trek plan
  async getShareableURL(id: string): Promise<ShareURLResponse> {
    return this.fetchAPI<ShareURLResponse>(
      TREK_PLAN_API_ENDPOINTS.SHARE_URL(id),
    );
  }
}

export const trekPlanAPI = new TrekPlanAPIService();

// PDF Generation utility (client-side)
export class PDFGenerator {
  static async generateTrekPlanPDF(
    pdfData: TrekPlanPDFData,
    filename: string = "trek-plan.pdf",
  ) {
    try {
      // Validate PDF data
      if (!pdfData || !pdfData.plan) {
        throw new Error("Invalid PDF data: Missing plan information");
      }

      // Log PDF data for debugging (remove in production)
      console.log("PDF Generation - Data received:", {
        planName: pdfData.plan.name,
        fortsCount: pdfData.forts?.length || 0,
        gearCount:
          pdfData.gear?.essential?.length ||
          0 + pdfData.gear?.optional?.length ||
          0,
        hasGearStats: !!pdfData.gear?.stats,
        hasSafety: !!pdfData.safety,
      });

      // Dynamic import for jsPDF to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF();
      let yPosition = 20;

      // Helper function to add text with word wrap
      const addText = (text: string, x: number, y: number, options?: any) => {
        const lines = doc.splitTextToSize(text, options?.maxWidth || 170);
        doc.text(lines, x, y);
        return y + lines.length * (options?.lineHeight || 7);
      };

      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(pdfData.plan.name || "Unnamed Trek Plan", 20, yPosition);
      yPosition += 15;

      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        20,
        yPosition,
      );
      yPosition += 15;

      // Plan Details Section
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Trek Plan Details", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const planDetails = [
        ["Trek Date", pdfData.plan.trekDate || "Not set"],
        ["Group Size", pdfData.plan.groupSize || "Not specified"],
        ["Experience Level", pdfData.plan.experience || "Not specified"],
        [
          "Estimated Duration",
          pdfData.plan.estimatedDuration || "Not specified",
        ],
        ["Total Distance", pdfData.plan.totalDistance || "Not specified"],
        ["Difficulty", pdfData.plan.difficulty || "Not specified"],
      ];

      (doc as any).autoTable({
        startY: yPosition,
        head: [["Detail", "Value"]],
        body: planDetails,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
        margin: { left: 20, right: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Description and Notes
      if (pdfData.plan.description) {
        doc.setFontSize(12);
        doc.text("Description:", 20, yPosition);
        yPosition += 7;
        doc.setFontSize(10);
        yPosition =
          addText(pdfData.plan.description, 20, yPosition, { maxWidth: 170 }) +
          5;
      }

      if (pdfData.plan.notes) {
        doc.setFontSize(12);
        doc.text("Notes:", 20, yPosition);
        yPosition += 7;
        doc.setFontSize(10);
        yPosition =
          addText(pdfData.plan.notes, 20, yPosition, { maxWidth: 170 }) + 10;
      }

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Selected Forts Section
      if (pdfData.forts && pdfData.forts.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Selected Forts", 20, yPosition);
        yPosition += 10;

        const fortTableData = pdfData.forts.map((fort) => [
          fort.name,
          fort.location,
          fort.difficulty,
          fort.duration,
          `${fort.elevation}m`,
          fort.entryFee,
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [
            [
              "Fort Name",
              "Location",
              "Difficulty",
              "Duration",
              "Elevation",
              "Entry Fee",
            ],
          ],
          body: fortTableData,
          theme: "grid",
          styles: { fontSize: 9 },
          headStyles: { fillColor: [40, 167, 69] },
          margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Check if we need a new page
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }

      // Gear Checklist Section
      doc.setFontSize(16);
      doc.text("Gear Checklist", 20, yPosition);
      yPosition += 10;

      // Gear stats
      doc.setFontSize(10);
      const gearStats = pdfData.gear?.stats || {
        checked: 0,
        total: 0,
        completion: 0,
        essentialChecked: 0,
        essentialTotal: 0,
        essentialCompletion: 0,
      };
      doc.text(
        `Completion: ${gearStats.checked}/${gearStats.total} items (${gearStats.completion}%)`,
        20,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Essential Items: ${gearStats.essentialChecked}/${gearStats.essentialTotal} (${gearStats.essentialCompletion}%)`,
        20,
        yPosition,
      );
      yPosition += 10;

      // Essential gear
      if (pdfData.gear?.essential && pdfData.gear.essential.length > 0) {
        const essentialGearData = pdfData.gear.essential.map((item) => [
          item.checked ? "✓" : "☐",
          item.item,
          item.category,
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [["✓", "Essential Items", "Category"]],
          body: essentialGearData,
          theme: "grid",
          styles: { fontSize: 9 },
          headStyles: { fillColor: [220, 53, 69] },
          margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Check if we need a new page for optional gear
      if (
        yPosition > 200 &&
        pdfData.gear?.optional &&
        pdfData.gear.optional.length > 0
      ) {
        doc.addPage();
        yPosition = 20;
      }

      // Optional gear
      if (pdfData.gear?.optional && pdfData.gear.optional.length > 0) {
        const optionalGearData = pdfData.gear.optional.map((item) => [
          item.checked ? "✓" : "☐",
          item.item,
          item.category,
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [["✓", "Optional Items", "Category"]],
          body: optionalGearData,
          theme: "grid",
          styles: { fontSize: 9 },
          headStyles: { fillColor: [23, 162, 184] },
          margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Safety Information
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text("Safety Information", 20, yPosition);
      yPosition += 10;

      // Emergency contacts
      doc.setFontSize(12);
      doc.text("Emergency Contacts:", 20, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      const emergencyContacts = pdfData.safety?.emergencyContacts || [];
      emergencyContacts.forEach((contact) => {
        doc.text(
          `${contact.name || "Contact"}: ${contact.number || "N/A"}`,
          25,
          yPosition,
        );
        yPosition += 6;
      });
      yPosition += 5;

      // Safety tips
      doc.setFontSize(12);
      doc.text("Safety Tips:", 20, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      const generalTips = pdfData.safety?.generalTips || [];
      generalTips.forEach((tip, index) => {
        yPosition =
          addText(`${index + 1}. ${tip}`, 25, yPosition, { maxWidth: 165 }) + 3;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Generated by FortTracker - Page ${i} of ${pageCount}`,
          20,
          285,
        );
        doc.text(`Trek Plan: ${pdfData.plan.name}`, 120, 285);
      }

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error("PDF Generation Error:", error);

      // Try fallback text export
      try {
        PDFGenerator.exportAsText(pdfData, filename.replace(".pdf", ".txt"));
        throw new Error(
          "PDF generation failed, but your trek plan has been downloaded as a text file instead.",
        );
      } catch (fallbackError) {
        console.error("Fallback export also failed:", fallbackError);
      }

      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (
          error.message.includes("jspdf") ||
          error.message.includes("module")
        ) {
          throw new Error(
            "PDF library failed to load. Please try again or contact support.",
          );
        } else if (error.message.includes("Invalid PDF data")) {
          throw new Error(
            "Trek plan data is incomplete. Please save your plan first.",
          );
        } else {
          throw new Error(`PDF generation failed: ${error.message}`);
        }
      } else {
        throw new Error(
          "PDF generation failed due to an unknown error. Please try again.",
        );
      }
    }
  }

  // Fallback text export when PDF generation fails
  static exportAsText(
    pdfData: TrekPlanPDFData,
    filename: string = "trek-plan.txt",
  ) {
    const content = `
TREK PLAN: ${pdfData.plan.name || "Unnamed Trek Plan"}
Generated on: ${new Date().toLocaleDateString()}

PLAN DETAILS:
- Trek Date: ${pdfData.plan.trekDate || "Not set"}
- Group Size: ${pdfData.plan.groupSize || "Not specified"}
- Experience Level: ${pdfData.plan.experience || "Not specified"}
- Estimated Duration: ${pdfData.plan.estimatedDuration || "Not specified"}
- Total Distance: ${pdfData.plan.totalDistance || "Not specified"}
- Difficulty: ${pdfData.plan.difficulty || "Not specified"}

${pdfData.plan.description ? `DESCRIPTION:\n${pdfData.plan.description}\n` : ""}
${pdfData.plan.notes ? `NOTES:\n${pdfData.plan.notes}\n` : ""}

SELECTED FORTS:
${
  pdfData.forts && pdfData.forts.length > 0
    ? pdfData.forts
        .map(
          (fort) =>
            `- ${fort.name || "Unknown"} (${fort.location || "Unknown location"})`,
        )
        .join("\n")
    : "No forts selected"
}

GEAR CHECKLIST:
Essential Items:
${
  pdfData.gear?.essential
    ? pdfData.gear.essential
        .map((item) => `${item.checked ? "✓" : "☐"} ${item.item}`)
        .join("\n")
    : "No essential items listed"
}

Optional Items:
${
  pdfData.gear?.optional
    ? pdfData.gear.optional
        .map((item) => `${item.checked ? "✓" : "☐"} ${item.item}`)
        .join("\n")
    : "No optional items listed"
}

SAFETY INFORMATION:
Emergency Contacts:
${
  pdfData.safety?.emergencyContacts
    ? pdfData.safety.emergencyContacts
        .map((contact) => `- ${contact.name}: ${contact.number}`)
        .join("\n")
    : "No emergency contacts listed"
}

Safety Tips:
${
  pdfData.safety?.generalTips
    ? pdfData.safety.generalTips
        .map((tip, index) => `${index + 1}. ${tip}`)
        .join("\n")
    : "No safety tips listed"
}
    `.trim();

    // Create and download text file
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Utility functions for trek plan operations
export const trekPlanHelpers = {
  formatGroupSize: (groupSize: string) => {
    switch (groupSize) {
      case "solo":
        return "Solo (1 person)";
      case "small":
        return "Small Group (2-5 people)";
      case "medium":
        return "Medium Group (6-10 people)";
      case "large":
        return "Large Group (10+ people)";
      default:
        return "Not specified";
    }
  },

  formatExperience: (experience: string) => {
    return experience.charAt(0).toUpperCase() + experience.slice(1);
  },

  getDifficultyColor: (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Difficult":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  },

  calculateGearCompletion: (gearList: GearItem[]) => {
    const total = gearList.length;
    const checked = gearList.filter((item) => item.checked).length;
    const essential = gearList.filter((item) => item.essential).length;
    const essentialChecked = gearList.filter(
      (item) => item.essential && item.checked,
    ).length;

    return {
      total,
      checked,
      completion: total > 0 ? Math.round((checked / total) * 100) : 0,
      essential,
      essentialChecked,
      essentialCompletion:
        essential > 0 ? Math.round((essentialChecked / essential) * 100) : 0,
    };
  },

  generateTrekPlanId: () => {
    return `trek-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  generateGearId: () => {
    return `gear-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};

export type {
  TrekPlan,
  TrekPlanSummary,
  EnrichedTrekPlan,
  GearItem,
  CreateTrekPlanRequest,
  UpdateTrekPlanRequest,
  TrekPlanPDFData,
};
