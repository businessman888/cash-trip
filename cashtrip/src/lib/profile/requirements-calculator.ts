import { QuizResponses, HardRequirements } from './types';

export function calculateHardRequirements(responses: QuizResponses): HardRequirements {
  const requirements: HardRequirements = {
    accommodation_type: [],
    location_preference: [],
    dietary_restrictions: [],
    essential_amenities: [],
    transport_preference: [],
    flight_class_preference: 'economy',
    must_have_experiences: [],
    has_pet: false,
    has_own_vehicle: false,
  };
  
  // Hospedagem
  if (responses.accommodationType) {
    requirements.accommodation_type = responses.accommodationType;
  }
  
  // Localização preferida
  if (responses.accommodationLocation) {
    const loc = responses.accommodationLocation.toLowerCase();
    if (loc.includes('centro') || loc.includes('urbano')) {
      requirements.location_preference.push('city_center', 'near_transport');
    } else if (loc.includes('praia')) {
      requirements.location_preference.push('beachfront', 'oceanfront');
    } else if (loc.includes('natureza')) {
      requirements.location_preference.push('nature', 'mountains');
    }
  }
  
  // Amenidades essenciais
  if (responses.accommodationEssentials) {
    requirements.essential_amenities = responses.accommodationEssentials;
  }
  
  // Adicionar academia se treina todo dia
  if (responses.workoutFrequency === 'everyday') {
    if (!requirements.essential_amenities.includes('gym')) {
      requirements.essential_amenities.push('gym');
    }
  }
  
  // Transporte
  if (responses.destinationTransportation) {
    requirements.transport_preference = [responses.destinationTransportation];
  }
  
  // Restrições alimentares
  if (responses.dietaryRestrictions && responses.dietaryRestrictions !== 'sem restrições') {
    requirements.dietary_restrictions = [responses.dietaryRestrictions];
  }
  
  // Pet e veículo
  requirements.has_pet = responses.travelWithPets === true;
  requirements.has_own_vehicle = responses.ownVehicle === true;
  
  // Experiências obrigatórias baseadas em preferências
  if (responses.daytimePlaces) {
    if (responses.daytimePlaces.includes('parksNature') || responses.daytimePlaces.includes('adventureSports')) {
      requirements.must_have_experiences.push('nature', 'adventure');
    }
    if (responses.daytimePlaces.includes('touristSpots')) {
      requirements.must_have_experiences.push('cultural_sites');
    }
  }
  
  return requirements;
}



