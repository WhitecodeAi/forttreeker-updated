import { RequestHandler } from "express";
import { TrekPlan, GearItem, TrekPlanService, TrekPlanSummary } from "../database/trek-plan-models";
import { fortsData } from "../data/forts";
import { trekPlanUtils } from "../data/trek-plans";

// GET /api/trek-plans - Get all trek plans for user
export const getAllTrekPlans: RequestHandler = async (req, res) => {
  try {
    const { limit, offset = '0', sortBy = 'createdAt' } = req.query;

    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: parseInt(offset as string) || 0,
      sortBy: sortBy as string
    };

    // Get plans from database
    const plans = await TrekPlanService.findAll(options);
    const total = await TrekPlanService.getCount();

    // Convert to summaries for list view
    const summaries = plans.map(TrekPlanService.createSummary);

    res.json({
      success: true,
      data: summaries,
      total,
      page: Math.floor(options.offset / (options.limit || total)) + 1,
      totalPages: options.limit ? Math.ceil(total / options.limit) : 1
    });
  } catch (error) {
    console.error('Error in getAllTrekPlans:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/trek-plans/:id - Get single trek plan by ID
export const getTrekPlanById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await TrekPlanService.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    // Enrich with fort details
    const enrichedPlan = {
      ...plan,
      fortDetails: plan.selectedForts.map(fortId =>
        fortsData.find(f => f.id === fortId)
      ).filter(Boolean)
    };

    res.json({
      success: true,
      data: enrichedPlan
    });
  } catch (error) {
    console.error('Error in getTrekPlanById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/trek-plans - Create new trek plan
export const createTrekPlan: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      selectedForts,
      trekDate,
      groupSize,
      experience,
      preferences,
      notes,
      gearChecklist
    } = req.body;

    // Validation
    if (!name || !selectedForts || !Array.isArray(selectedForts)) {
      return res.status(400).json({
        success: false,
        message: 'Name and selectedForts are required'
      });
    }

    // Validate selected forts exist
    const validForts = selectedForts.filter(fortId =>
      fortsData.some(f => f.id === fortId)
    );

    if (validForts.length !== selectedForts.length) {
      return res.status(400).json({
        success: false,
        message: 'Some selected forts do not exist'
      });
    }

    const planData = {
      name: name.trim(),
      description: description?.trim(),
      selectedForts: validForts,
      trekDate,
      groupSize: groupSize || '',
      experience: experience || '',
      preferences: preferences || [],
      notes: notes || '',
      estimatedDuration: trekPlanUtils.calculateDuration(validForts),
      totalDistance: trekPlanUtils.calculateDistance(validForts),
      difficulty: trekPlanUtils.calculateDifficulty(validForts),
      gearChecklist: gearChecklist || trekPlanUtils.createDefaultGearChecklist()
    };

    const newPlan = await TrekPlanService.create(planData);

    res.status(201).json({
      success: true,
      data: newPlan,
      message: 'Trek plan created successfully'
    });
  } catch (error) {
    console.error('Error in createTrekPlan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/trek-plans/:id - Update trek plan
export const updateTrekPlan: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if plan exists
    const existingPlan = await TrekPlanService.findById(id);
    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    // Validate selected forts if provided
    if (updateData.selectedForts) {
      const validForts = updateData.selectedForts.filter((fortId: number) =>
        fortsData.some(f => f.id === fortId)
      );

      if (validForts.length !== updateData.selectedForts.length) {
        return res.status(400).json({
          success: false,
          message: 'Some selected forts do not exist'
        });
      }
      updateData.selectedForts = validForts;

      // Recalculate derived fields if selectedForts changed
      updateData.estimatedDuration = trekPlanUtils.calculateDuration(updateData.selectedForts);
      updateData.totalDistance = trekPlanUtils.calculateDistance(updateData.selectedForts);
      updateData.difficulty = trekPlanUtils.calculateDifficulty(updateData.selectedForts);
    }

    const updatedPlan = await TrekPlanService.update(id, updateData);

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    res.json({
      success: true,
      data: updatedPlan,
      message: 'Trek plan updated successfully'
    });
  } catch (error) {
    console.error('Error in updateTrekPlan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// DELETE /api/trek-plans/:id - Delete trek plan
export const deleteTrekPlan: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TrekPlanService.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Trek plan deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTrekPlan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/trek-plans/:id/duplicate - Duplicate trek plan
export const duplicateTrekPlan: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPlan = await TrekPlanService.findById(id);

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    const duplicatedData = {
      ...existingPlan,
      name: `${existingPlan.name} (Copy)`,
      // Reset gear checklist
      gearChecklist: existingPlan.gearChecklist.map(item => ({
        ...item,
        id: trekPlanUtils.generateGearId(),
        checked: false
      }))
    };

    delete (duplicatedData as any).id;
    delete (duplicatedData as any).createdAt;
    delete (duplicatedData as any).updatedAt;

    const duplicatedPlan = await TrekPlanService.create(duplicatedData);

    res.status(201).json({
      success: true,
      data: duplicatedPlan,
      message: 'Trek plan duplicated successfully'
    });
  } catch (error) {
    console.error('Error in duplicateTrekPlan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PATCH /api/trek-plans/:id/gear - Update gear checklist
export const updateGearChecklist: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { gearChecklist } = req.body;

    if (!Array.isArray(gearChecklist)) {
      return res.status(400).json({
        success: false,
        message: 'gearChecklist must be an array'
      });
    }

    const updatedPlan = await TrekPlanService.update(id, { gearChecklist });

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    res.json({
      success: true,
      data: updatedPlan,
      message: 'Gear checklist updated successfully'
    });
  } catch (error) {
    console.error('Error in updateGearChecklist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/trek-plans/stats - Get trek plans statistics
export const getTrekPlanStats: RequestHandler = async (req, res) => {
  try {
    const allPlans = await TrekPlanService.findAll();

    const stats = {
      totalPlans: allPlans.length,
      upcomingTreks: allPlans.filter(plan =>
        plan.trekDate && new Date(plan.trekDate) > new Date()
      ).length,
      completedTreks: allPlans.filter(plan =>
        plan.trekDate && new Date(plan.trekDate) < new Date()
      ).length,
      averageFortsPerPlan: allPlans.length > 0
        ? allPlans.reduce((sum, plan) => sum + plan.selectedForts.length, 0) / allPlans.length
        : 0,
      difficultyDistribution: {
        Easy: allPlans.filter(p => p.difficulty === 'Easy').length,
        Moderate: allPlans.filter(p => p.difficulty === 'Moderate').length,
        Difficult: allPlans.filter(p => p.difficulty === 'Difficult').length,
        Expert: allPlans.filter(p => p.difficulty === 'Expert').length
      },
      popularPreferences: getPopularPreferences(allPlans)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getTrekPlanStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to get popular preferences
function getPopularPreferences(plans: TrekPlan[]) {
  const preferenceCount = new Map<string, number>();

  plans.forEach(plan => {
    plan.preferences.forEach(pref => {
      preferenceCount.set(pref, (preferenceCount.get(pref) || 0) + 1);
    });
  });

  return Array.from(preferenceCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([preference, count]) => ({ preference, count }));
}
