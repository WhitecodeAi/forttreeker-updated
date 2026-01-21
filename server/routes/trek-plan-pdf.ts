import { RequestHandler } from "express";
import { trekPlansStorage } from "../data/trek-plans";
import { fortsData } from "../data/forts";

// PDF generation will be done on the client side using jsPDF
// This endpoint returns formatted data for PDF generation

// GET /api/trek-plans/:id/pdf-data - Get trek plan data formatted for PDF
export const getTrekPlanPDFData: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = trekPlansStorage.find(p => p.id === id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    // Get detailed fort information
    const fortDetails = plan.selectedForts.map(fortId => 
      fortsData.find(f => f.id === fortId)
    ).filter(Boolean);

    // Calculate gear completion stats
    const totalGear = plan.gearChecklist.length;
    const checkedGear = plan.gearChecklist.filter(item => item.checked).length;
    const essentialGear = plan.gearChecklist.filter(item => item.essential).length;
    const checkedEssentialGear = plan.gearChecklist.filter(item => item.essential && item.checked).length;

    // Format data for PDF
    const pdfData = {
      // Plan details
      plan: {
        name: plan.name,
        description: plan.description || '',
        trekDate: plan.trekDate ? new Date(plan.trekDate).toLocaleDateString() : 'Not set',
        groupSize: formatGroupSize(plan.groupSize),
        experience: plan.experience || 'Not specified',
        estimatedDuration: plan.estimatedDuration,
        totalDistance: `${plan.totalDistance} km`,
        difficulty: plan.difficulty,
        notes: plan.notes || '',
        preferences: plan.preferences,
        createdAt: plan.createdAt.toLocaleDateString(),
        updatedAt: plan.updatedAt.toLocaleDateString()
      },

      // Fort details
      forts: fortDetails.map(fort => ({
        name: fort?.name || '',
        location: fort?.location || '',
        district: fort?.district || '',
        difficulty: fort?.difficulty || '',
        duration: fort?.duration || '',
        elevation: fort?.elevation || 0,
        rating: fort?.rating || 0,
        description: fort?.description || '',
        highlights: fort?.highlights || [],
        accessibility: fort?.accessibility || {},
        facilities: fort?.facilities || {},
        entryFee: fort?.entryFee || '',
        timings: fort?.timings || ''
      })),

      // Gear checklist
      gear: {
        stats: {
          total: totalGear,
          checked: checkedGear,
          completion: totalGear > 0 ? Math.round((checkedGear / totalGear) * 100) : 0,
          essentialTotal: essentialGear,
          essentialChecked: checkedEssentialGear,
          essentialCompletion: essentialGear > 0 ? Math.round((checkedEssentialGear / essentialGear) * 100) : 0
        },
        essential: plan.gearChecklist.filter(item => item.essential),
        optional: plan.gearChecklist.filter(item => !item.essential),
        byCategory: categorizeGear(plan.gearChecklist)
      },

      // Safety information
      safety: {
        emergencyContacts: [
          { name: 'Local Emergency Services', number: '112' },
          { name: 'Forest Department', number: '1926' },
          { name: 'Tourist Helpline', number: '1363' }
        ],
        generalTips: [
          'Inform someone about your trek plan and expected return time',
          'Check weather conditions before starting the trek',
          'Carry sufficient water and food',
          'Start early to avoid afternoon heat',
          'Stay on marked trails',
          'Respect local environment and culture'
        ]
      },

      // Weather tips
      weather: {
        bestMonths: getUniqueValues(fortDetails.map(fort => fort?.bestSeason || []).flat()),
        tips: [
          'Check weather forecast 24 hours before trek',
          'Avoid trekking during heavy rain or storms',
          'Carry rain gear during monsoon season',
          'Dress in layers for temperature variations'
        ]
      }
    };

    res.json({
      success: true,
      data: pdfData
    });
  } catch (error) {
    console.error('Error in getTrekPlanPDFData:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper functions
function formatGroupSize(groupSize: string): string {
  switch (groupSize) {
    case 'solo': return 'Solo (1 person)';
    case 'small': return 'Small Group (2-5 people)';
    case 'medium': return 'Medium Group (6-10 people)';
    case 'large': return 'Large Group (10+ people)';
    default: return 'Not specified';
  }
}

function categorizeGear(gearList: any[]) {
  const categories = {
    equipment: [] as any[],
    clothing: [] as any[],
    food: [] as any[],
    safety: [] as any[],
    navigation: [] as any[],
    other: [] as any[]
  };

  gearList.forEach(item => {
    if (categories[item.category as keyof typeof categories]) {
      categories[item.category as keyof typeof categories].push(item);
    } else {
      categories.other.push(item);
    }
  });

  return categories;
}

function getUniqueValues(array: string[]): string[] {
  return [...new Set(array)].filter(Boolean);
}

// POST /api/trek-plans/:id/pdf-download - Trigger PDF download (returns download instructions)
export const downloadTrekPlanPDF: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = trekPlansStorage.find(p => p.id === id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    // In a real application, you might want to track download events
    // For now, we just return success and let the frontend handle PDF generation
    res.json({
      success: true,
      message: 'PDF data ready for download',
      filename: `${plan.name.replace(/[^a-zA-Z0-9]/g, '_')}_Trek_Plan.pdf`
    });
  } catch (error) {
    console.error('Error in downloadTrekPlanPDF:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/trek-plans/:id/share-url - Generate shareable URL for trek plan
export const getShareableURL: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = trekPlansStorage.find(p => p.id === id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Trek plan not found'
      });
    }

    // Generate a shareable URL (in production, this might involve creating a public link)
    const shareUrl = `${req.protocol}://${req.get('host')}/trek-plan/${id}`;
    
    res.json({
      success: true,
      data: {
        shareUrl,
        planName: plan.name,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }
    });
  } catch (error) {
    console.error('Error in getShareableURL:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
