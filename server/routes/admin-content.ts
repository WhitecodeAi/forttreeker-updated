import { Router } from "express";
import { requireAuth, requireAdmin } from "./auth.js";
import {
  executeQuery,
  executeQuerySingle,
  executeInsert,
  executeUpdate,
} from "../database/connection.js";

const router = Router();

// Footer Content Management
router.get("/footer-content", async (req, res) => {
  try {
    const footerContent = await executeQuerySingle(`
      SELECT * FROM site_content WHERE type = 'footer' ORDER BY updated_at DESC LIMIT 1
    `);

    if (footerContent) {
      let content = footerContent.content;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          console.error("Failed to parse footer content JSON:", e);
        }
      }

      res.json({
        success: true,
        data: {
          id: footerContent.id,
          aboutText: content?.aboutText || "",
          contactEmail: content?.contactEmail || "",
          contactPhone: content?.contactPhone || "",
          address: content?.address || "",
          socialLinks: content?.socialLinks || {},
          quickLinks: content?.quickLinks || [],
          updatedAt: footerContent.updated_at,
        },
      });
    } else {
      res.json({
        success: false,
        message: "No footer content found",
      });
    }
  } catch (error) {
    console.error("Error fetching footer content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch footer content",
    });
  }
});

router.put("/footer-content", requireAdmin, async (req, res) => {
  try {
    const {
      aboutText,
      contactEmail,
      contactPhone,
      address,
      socialLinks,
      quickLinks,
    } = req.body;

    const content = {
      aboutText,
      contactEmail,
      contactPhone,
      address,
      socialLinks,
      quickLinks,
    };

    // Check if footer content exists
    const existing = await executeQuerySingle(`
      SELECT id FROM site_content WHERE type = 'footer'
    `);

    if (existing) {
      // Update existing
      await executeUpdate(
        `
        UPDATE site_content 
        SET content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE type = 'footer'
      `,
        [JSON.stringify(content)],
      );
    } else {
      // Create new
      await executeInsert(
        `
        INSERT INTO site_content (type, content, created_at, updated_at)
        VALUES ('footer', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
        [JSON.stringify(content)],
      );
    }

    res.json({
      success: true,
      message: "Footer content updated successfully",
    });
  } catch (error) {
    console.error("Error updating footer content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update footer content",
    });
  }
});

// Helper function to map database trek group row to frontend format
function mapTrekGroupRow(g: any) {
  let content: any = {};
  if (g.content) {
    if (typeof g.content === "string") {
      try {
        content = JSON.parse(g.content);
      } catch (e) {
        console.error("Failed to parse trek group content JSON:", e);
      }
    } else if (typeof g.content === "object") {
      content = g.content;
    }
  }

  const included = Array.isArray(content.included) ? content.included : [];
  const requirements = Array.isArray(content.requirements) ? content.requirements : [];
  const tags = Array.isArray(content.tags) ? content.tags : [];

  return {
    id: g.id,
    title: g.title,
    description: g.description,
    fortName: g.fort_name,
    organizerName: g.organizer_name || "Anonymous",
    organizerEmail: g.organizer_email || "",
    organizer: {
      name: g.organizer_name || "Anonymous",
      email: g.organizer_email || "",
      rating: 4.8,
      completedTreks: 15,
    },
    trekDate: g.trek_date,
    duration: g.duration,
    difficulty: g.difficulty,
    maxParticipants: g.max_participants,
    currentParticipants: g.current_participants || 0,
    meetingPoint: g.meeting_point,
    cost: typeof g.cost === "number" ? g.cost : parseFloat(g.cost || "0"),
    included,
    requirements,
    status: g.status || "open",
    createdAt: g.created_at,
    tags,
  };
}

// Trek Groups Management
router.get("/trek-groups", async (req, res) => {
  try {
    let query = `
      SELECT tg.*, u.full_name as organizer_name, u.email as organizer_email
      FROM trek_groups tg
      LEFT JOIN users u ON tg.organizer_id = u.id
      ORDER BY tg.trek_date ASC
    `;
    const groups = await executeQuery(query, []);
    const mappedGroups = groups.map(mapTrekGroupRow);

    res.status(200).json({
      success: true,
      message: "successfully fetched data",
      groups: mappedGroups,
      data: mappedGroups,
    });
  } catch (error) {
    console.error("Error fetching trek groups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trek groups",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    let query = `
      SELECT tg.*, u.full_name as organizer_name, u.email as organizer_email
      FROM trek_groups tg
      LEFT JOIN users u ON tg.organizer_id = u.id
      ORDER BY tg.trek_date ASC
    `;
    const groups = await executeQuery(query, []);
    const mappedGroups = groups.map(mapTrekGroupRow);

    res.status(200).json({
      success: true,
      message: "successfully fetched data",
      groups: mappedGroups,
      data: mappedGroups,
    });
  } catch (error) {
    console.error("Error fetching trek groups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trek groups",
    });
  }
});

router.post("/trek-groups", requireAuth, async (req: any, res) => {
  try {
    const {
      title,
      description,
      fortName,
      trekDate,
      duration,
      difficulty,
      maxParticipants,
      meetingPoint,
      cost,
      included,
      requirements,
      tags,
    } = req.body;

    const groupId = await executeInsert(
      `
      INSERT INTO trek_groups (
        organizer_id, title, description, fort_name, trek_date, duration,
        difficulty, max_participants, meeting_point, cost, content, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      [
        req.user.id,
        title,
        description,
        fortName,
        trekDate,
        duration,
        difficulty,
        maxParticipants,
        meetingPoint,
        cost,
        JSON.stringify({ included, requirements, tags }),
      ],
    );

    res.json({
      success: true,
      message: "Trek group created successfully",
      data: { id: groupId.insertId },
    });
  } catch (error) {
    console.error("Error creating trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trek group",
    });
  }
});

router.post("/", requireAuth, async (req: any, res) => {
  try {
    const {
      title,
      description,
      fortName,
      trekDate,
      duration,
      difficulty,
      maxParticipants,
      meetingPoint,
      cost,
      included,
      requirements,
      tags,
    } = req.body;

    const groupId = await executeInsert(
      `
      INSERT INTO trek_groups (
        organizer_id, title, description, fort_name, trek_date, duration,
        difficulty, max_participants, meeting_point, cost, content, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      [
        req.user.id,
        title,
        description,
        fortName,
        trekDate,
        duration,
        difficulty,
        maxParticipants,
        meetingPoint,
        cost,
        JSON.stringify({ included, requirements, tags }),
      ],
    );

    res.json({
      success: true,
      message: "Trek group created successfully",
      data: { id: groupId.insertId },
    });
  } catch (error) {
    console.error("Error creating trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trek group",
    });
  }
});

router.post("/trek-groups/:id/join", requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if group exists and has space
    const group = await executeQuerySingle(
      `
      SELECT current_participants, max_participants, status
      FROM trek_groups 
      WHERE id = ?
    `,
      [id],
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Trek group not found",
      });
    }

    if (group.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Trek group is not open for registration",
      });
    }

    if (group.current_participants >= group.max_participants) {
      return res.status(400).json({
        success: false,
        message: "Trek group is full",
      });
    }

    // Check if user already joined
    const existing = await executeQuerySingle(
      `
      SELECT id FROM trek_group_participants
      WHERE group_id = ? AND user_id = ?
    `,
      [id, userId],
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this group",
      });
    }

    // Add participant
    await executeInsert(
      `
      INSERT INTO trek_group_participants (group_id, user_id, joined_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `,
      [id, userId],
    );

    // Update participant count
    await executeUpdate(
      `
      UPDATE trek_groups 
      SET current_participants = current_participants + 1,
          status = CASE 
            WHEN current_participants + 1 >= max_participants THEN 'full'
            ELSE 'open'
          END
      WHERE id = ?
    `,
      [id],
    );

    res.json({
      success: true,
      message: "Successfully joined the trek group",
    });
  } catch (error) {
    console.error("Error joining trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join trek group",
    });
  }
});

router.post("/:id/join", requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if group exists and has space
    const group = await executeQuerySingle(
      `
      SELECT current_participants, max_participants, status
      FROM trek_groups 
      WHERE id = ?
    `,
      [id],
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Trek group not found",
      });
    }

    if (group.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Trek group is not open for registration",
      });
    }

    if (group.current_participants >= group.max_participants) {
      return res.status(400).json({
        success: false,
        message: "Trek group is full",
      });
    }

    // Check if user already joined
    const existing = await executeQuerySingle(
      `
      SELECT id FROM trek_group_participants
      WHERE group_id = ? AND user_id = ?
    `,
      [id, userId],
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this group",
      });
    }

    // Add participant
    await executeInsert(
      `
      INSERT INTO trek_group_participants (group_id, user_id, joined_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `,
      [id, userId],
    );

    // Update participant count
    await executeUpdate(
      `
      UPDATE trek_groups 
      SET current_participants = current_participants + 1,
          status = CASE 
            WHEN current_participants + 1 >= max_participants THEN 'full'
            ELSE 'open'
          END
      WHERE id = ?
    `,
      [id],
    );

    res.json({
      success: true,
      message: "Successfully joined the trek group",
    });
  } catch (error) {
    console.error("Error joining trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join trek group",
    });
  }
});

router.delete("/trek-groups/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await executeUpdate("DELETE FROM trek_groups WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Trek group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete trek group",
    });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await executeUpdate("DELETE FROM trek_groups WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Trek group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trek group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete trek group",
    });
  }
});

// Site Pages Management (for dynamic pages)
router.get("/pages", async (req, res) => {
  try {
    const pages = await executeQuery(`
      SELECT * FROM site_content WHERE type = 'page' ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: pages.map((page) => {
        let content = page.content;
        if (typeof content === "string") {
          try {
            content = JSON.parse(content);
          } catch (e) {
            console.error("Failed to parse page content:", e);
          }
        }
        return {
          id: page.id,
          slug: page.slug,
          title: content?.title || "",
          content: content?.content || "",
          isPublished: page.is_published,
          createdAt: page.created_at,
          updatedAt: page.updated_at,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
    });
  }
});

router.post("/pages", requireAdmin, async (req, res) => {
  try {
    const { slug, title, content, isPublished = true } = req.body;

    const pageContent = { title, content };

    const pageId = await executeInsert(
      `
      INSERT INTO site_content (type, slug, content, is_published, created_at, updated_at)
      VALUES ('page', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      [slug, JSON.stringify(pageContent), isPublished],
    );

    res.json({
      success: true,
      message: "Page created successfully",
      data: { id: pageId.insertId },
    });
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create page",
    });
  }
});

router.put("/pages/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, content, isPublished } = req.body;

    const pageContent = { title, content };

    await executeUpdate(
      `
      UPDATE site_content 
      SET slug = ?, content = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND type = 'page'
    `,
      [slug, JSON.stringify(pageContent), isPublished, id],
    );

    res.json({
      success: true,
      message: "Page updated successfully",
    });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update page",
    });
  }
});

router.delete("/pages/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await executeUpdate(
      `
      DELETE FROM site_content WHERE id = ? AND type = 'page'
    `,
      [id],
    );

    res.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete page",
    });
  }
});

export default router;
