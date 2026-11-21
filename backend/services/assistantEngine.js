/**
 * "What Should I Do?" Smart Waste & Item Guidance Engine
 * Rule-based recommendation engine for responsible item handling, segregation, reuse, and disposal.
 * Ready for future AI/LLM plug-in while remaining deterministic, explainable, and offline-reliable.
 */

const KNOWLEDGE_BASE = [
  {
    keywords: ['cloth', 'clothes', 'shirt', 'pants', 'dress', 'jacket', 'textile', 'blanket', 'curtain'],
    itemIdentified: 'Clothing / Textiles',
    recommendedAction: 'Donate or Give Away',
    reason: 'Textile production has high water and carbon footprints. Giving usable garments to others extends their lifecycle significantly.',
    alternativeAction: 'Repurpose into cleaning rags or visit textile recycling collection bins.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Create a Donation Listing' }
  },
  {
    keywords: ['vegetable', 'peel', 'fruit', 'food', 'leftover', 'kitchen waste', 'egg shell', 'coffee ground', 'tea leaf'],
    itemIdentified: 'Organic Kitchen / Wet Waste',
    recommendedAction: 'Compost at Home or Segregate as Wet Waste',
    reason: 'Organic waste creates methane in landfills. Composting converts nutrient-rich biomass into fertile organic soil for plants.',
    alternativeAction: 'Place in designated green municipal wet-waste bin for community biogas/composting.',
    relatedModule: { name: 'Waste Segregation Guide', route: '/education', action: 'Learn Wet Waste Best Practices' }
  },
  {
    keywords: ['mobile', 'phone', 'smartphone', 'laptop', 'charger', 'battery', 'tablet', 'gadget', 'wire', 'cable', 'electronics', 'computer'],
    itemIdentified: 'Electronic Waste (E-Waste)',
    recommendedAction: 'Authorized E-Waste Collection / Recycling',
    reason: 'Electronics contain hazardous heavy metals (lead, mercury, cadmium) as well as precious recoverable materials (gold, copper).',
    alternativeAction: 'If working, consider listing on the Civic Impact Reuse portal or exchanging with manufacturer buyback.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find E-Waste Centres' }
  },
  {
    keywords: ['plastic bottle', 'water bottle', 'shampoo bottle', 'plastic container', 'pet bottle', 'jug'],
    itemIdentified: 'Rigid Plastics (PET / HDPE)',
    recommendedAction: 'Rinse, Crush & Recycle',
    reason: 'Clean rigid plastics are 100% mechanically recyclable into new containers, polyester fibres, and construction materials.',
    alternativeAction: 'Schedule a Dry Waste Pickup on Civic Impact.',
    relatedModule: { name: 'Request Waste Pickup', route: '/pickup', action: 'Book Dry Waste Pickup' }
  },
  {
    keywords: ['book', 'textbook', 'notebook', 'novel', 'study material', 'stationery', 'magazine'],
    itemIdentified: 'Books & Educational Material',
    recommendedAction: 'Donate to Students or Local Libraries',
    reason: 'Books retain intellectual and educational value for decades. Sharing books fosters equal learning access in your community.',
    alternativeAction: 'If torn beyond use, recycle along with clean dry paper.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Share Study Materials' }
  },
  {
    keywords: ['furniture', 'chair', 'table', 'desk', 'sofa', 'wardrobe', 'bed', 'stool', 'cupboard'],
    itemIdentified: 'Furniture & Woodwork',
    recommendedAction: 'Repair or Give Away for Second Life',
    reason: 'Bulk furniture takes enormous landfill space. Donating or minor refurbishing gives affordable utility to new homes.',
    alternativeAction: 'Dismantle into scrap wood and metal for licensed salvage recyclers.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'List Furniture' }
  },
  {
    keywords: ['cardboard', 'carton', 'box', 'paper packaging', 'newspaper'],
    itemIdentified: 'Cardboard & Paper Packaging',
    recommendedAction: 'Flatten & Dry Waste Recycling',
    reason: 'Cardboard can be pulped and re-molded into corrugated packaging up to 5-7 times, saving virgin timber and forest cover.',
    alternativeAction: 'Reuse sturdy packaging boxes for home storage or shipping.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find Paper Recyclers' }
  },
  {
    keywords: ['medicine', 'expired pill', 'tablet', 'syrup', 'syringe', 'ointment'],
    itemIdentified: 'Expired Medicines / Pharmaceutical Waste',
    recommendedAction: 'Hazardous Waste Safe Disposal',
    reason: 'Flushing drugs contaminates groundwater, rivers, and aquatic ecosystems, breeding antimicrobial-resistant pathogens.',
    alternativeAction: 'Hand over to authorized pharmacy take-back drop boxes or municipal toxic waste drive.',
    relatedModule: { name: 'Waste Education & Hazards', route: '/education', action: 'Review Hazardous Guidelines' }
  },
  {
    keywords: ['paint', 'solvent', 'varnish', 'pesticide', 'insecticide', 'chemical', 'bleach'],
    itemIdentified: 'Household Chemical & Hazardous Waste',
    recommendedAction: 'Do NOT Pour Down Drains; Use Hazardous Drop-Off',
    reason: 'Household chemicals corrode sewage pipes and poison water treatment bio-filters.',
    alternativeAction: 'Dry small latex paint residues with sand/sawdust before disposal, or submit a specialized pickup request.',
    relatedModule: { name: 'Report Civic Hazard / Illegal Dumping', route: '/complaints/new', action: 'Report Toxic Spills' }
  },
  {
    keywords: ['glass bottle', 'jar', 'broken glass', 'mirror', 'window glass'],
    itemIdentified: 'Glass Containers & Cullet',
    recommendedAction: 'Reuse Glass Jars or Wrap & Recycle',
    reason: 'Glass is endlessly recyclable without loss of purity or quality. Wrap broken glass securely to protect sanitation workers.',
    alternativeAction: 'Rinse glass jars for spice or pantry ingredient storage.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find Glass Recyclers' }
  },
  {
    keywords: ['toy', 'doll', 'board game', 'puzzle', 'action figure'],
    itemIdentified: 'Toys & Children Items',
    recommendedAction: 'Sanitize & Donate to Children / Shelter',
    reason: 'Composite plastic and wooden toys rarely recycle well, but bring immense joy to children when shared.',
    alternativeAction: 'List under Civic Impact Toys giveaway section.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Donate Toys' }
  },
  {
    keywords: ['car battery', 'lead battery', 'inverter battery', 'dry cell'],
    itemIdentified: 'Lead-Acid / Heavy Metal Battery',
    recommendedAction: 'Authorized Battery Scrapyard / Dealer Exchange',
    reason: 'Lead-acid batteries carry severe toxic lead and corrosive sulfuric acid that require closed-loop smelting facilities.',
    alternativeAction: 'Avail buyback scrap discount at your battery retailer.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Locate Certified Scrapyards' }
  }
];

function analyzeItem(userQuery = '') {
  const normalized = userQuery.toLowerCase().trim();

  if (!normalized) {
    return {
      success: false,
      message: 'Please provide a description of the item or waste material.'
    };
  }

  // Find best match in knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    const matchedKeyword = entry.keywords.find(kw => normalized.includes(kw));
    if (matchedKeyword) {
      return {
        success: true,
        matchedKeyword,
        itemIdentified: entry.itemIdentified,
        recommendedAction: entry.recommendedAction,
        reason: entry.reason,
        alternativeAction: entry.alternativeAction,
        relatedModule: entry.relatedModule
      };
    }
  }

  // General fallback for unknown items
  return {
    success: true,
    matchedKeyword: null,
    itemIdentified: 'Unclassified Item / General Civic Material',
    recommendedAction: 'Inspect Condition: Reuse if Functional, Segregate if Waste',
    reason: 'When unsure, prioritize the waste hierarchy: 1. Reduce/Refuse → 2. Reuse/Donate → 3. Recycle → 4. Municipal Waste Pickup.',
    alternativeAction: 'Check our Waste Segregation Guide or ask municipal sanitation staff.',
    relatedModule: {
      name: 'Waste Segregation Guide',
      route: '/education',
      action: 'Browse Waste Categories'
    }
  };
}

module.exports = {
  analyzeItem,
  KNOWLEDGE_BASE
};
