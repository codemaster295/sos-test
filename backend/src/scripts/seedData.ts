import db from '../database/database';
import { Ambulance, Doctor } from '../types';

// Center coordinates: Amroli, Gujarat, India
const CENTER_LAT = 21.241956;
const CENTER_LON = 72.876412;

// Function to generate random coordinates within a radius (in km)
function generateRandomCoordinates(centerLat: number, centerLon: number, maxRadiusKm: number): { lat: number; lon: number } {
  // Convert km to degrees (approximate)
  const radiusInDegrees = maxRadiusKm / 111;
  
  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;
  
  const lat = centerLat + (distance * Math.cos(angle));
  const lon = centerLon + (distance * Math.sin(angle));
  
  return { lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) };
}

// Ambulance data
const ambulanceData: Array<Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>> = [
  // Close to center (within 5km)
  { title: 'Amroli Emergency Ambulance Service', description: '24/7 emergency ambulance service with advanced life support equipment. Serving Amroli and surrounding areas with quick response time.', location: 'Amroli Main Road, Amroli, Surat, Gujarat 394105', latitude: 21.245000, longitude: 72.878000, phone: '+91 261 2345678', image: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Ambulance+1' },
  { title: 'Surat City Ambulance', description: 'Professional ambulance service with trained paramedics and modern medical equipment. Available round the clock for emergency situations.', location: 'Near Amroli Bus Stand, Surat, Gujarat', latitude: 21.238000, longitude: 72.874000, phone: '+91 261 2345679', image: 'https://placehold.co/600x400/CC0000/FFFFFF?text=Ambulance+2' },
  { title: 'Gujarat Emergency Medical Services', description: 'State-of-the-art ambulance with ICU facilities. Equipped with ventilator, defibrillator, and trained medical staff.', location: 'Amroli Industrial Area, Surat, Gujarat', latitude: 21.243000, longitude: 72.880000, phone: '+91 261 2345680', image: 'https://placehold.co/600x400/990000/FFFFFF?text=Ambulance+3' },
  { title: 'Rapid Response Ambulance', description: 'Fast response ambulance service with GPS tracking. Specialized in critical care transportation and emergency medical services.', location: 'Amroli Cross Road, Surat, Gujarat 394105', latitude: 21.240000, longitude: 72.875000, phone: '+91 261 2345681', image: 'https://placehold.co/600x400/FF3333/FFFFFF?text=Ambulance+4' },
  { title: 'Life Line Ambulance Service', description: 'Reliable ambulance service with experienced drivers and medical professionals. Serving Surat district with dedication.', location: 'Amroli Village, Surat, Gujarat', latitude: 21.242000, longitude: 72.877000, phone: '+91 261 2345682', image: 'https://placehold.co/600x400/FF6666/FFFFFF?text=Ambulance+5' },
  
  // Medium distance (5-15km)
  { title: 'Surat Emergency Care', description: 'Advanced life support ambulance with cardiac monitoring equipment. Specialized in heart attack and stroke emergencies.', location: 'Adajan, Surat, Gujarat 395009', latitude: 21.220000, longitude: 72.850000, phone: '+91 261 2345683', image: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Ambulance+6' },
  { title: 'City Ambulance Network', description: 'Network of ambulances covering entire Surat city. Quick response time with GPS-enabled fleet management.', location: 'Vesu, Surat, Gujarat 395007', latitude: 21.260000, longitude: 72.900000, phone: '+91 261 2345684', image: 'https://placehold.co/600x400/CC0000/FFFFFF?text=Ambulance+7' },
  { title: 'Gujarat Medical Transport', description: 'Professional medical transport service with ICU ambulances. Available for inter-hospital transfers and emergency cases.', location: 'Piplod, Surat, Gujarat 395007', latitude: 21.250000, longitude: 72.850000, phone: '+91 261 2345685', image: 'https://placehold.co/600x400/990000/FFFFFF?text=Ambulance+8' },
  { title: 'Emergency Response Team', description: 'Trained emergency medical technicians with modern ambulance fleet. Serving Surat and nearby districts.', location: 'Varachha, Surat, Gujarat 395006', latitude: 21.230000, longitude: 72.900000, phone: '+91 261 2345686', image: 'https://placehold.co/600x400/FF3333/FFFFFF?text=Ambulance+9' },
  { title: 'Surat Ambulance Services', description: '24/7 ambulance service with oxygen support and basic life support equipment. Affordable and reliable emergency transport.', location: 'Katargam, Surat, Gujarat 395004', latitude: 21.210000, longitude: 72.870000, phone: '+91 261 2345687', image: 'https://placehold.co/600x400/FF6666/FFFFFF?text=Ambulance+10' },
  
  // Far distance (15-30km)
  { title: 'Bharuch Emergency Ambulance', description: 'Emergency ambulance service covering Bharuch district. Equipped with advanced medical equipment and trained staff.', location: 'Bharuch, Gujarat 392001', latitude: 21.700000, longitude: 72.950000, phone: '+91 2642 2345688', image: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Ambulance+11' },
  { title: 'Navsari Medical Ambulance', description: 'Professional ambulance service in Navsari with ICU facilities. Specialized in critical patient transportation.', location: 'Navsari, Gujarat 396445', latitude: 20.950000, longitude: 72.920000, phone: '+91 2637 2345689', image: 'https://placehold.co/600x400/CC0000/FFFFFF?text=Ambulance+12' },
  { title: 'Valsad Emergency Services', description: 'Round-the-clock ambulance service in Valsad. Quick response time with GPS tracking and trained paramedics.', location: 'Valsad, Gujarat 396001', latitude: 20.600000, longitude: 72.930000, phone: '+91 2632 2345690', image: 'https://placehold.co/600x400/990000/FFFFFF?text=Ambulance+13' },
  { title: 'Ankleshwar Ambulance Network', description: 'Comprehensive ambulance network serving Ankleshwar industrial area. Available for medical emergencies 24/7.', location: 'Ankleshwar, Gujarat 393002', latitude: 21.600000, longitude: 72.980000, phone: '+91 2646 2345691', image: 'https://placehold.co/600x400/FF3333/FFFFFF?text=Ambulance+14' },
  { title: 'Bardoli Emergency Care', description: 'Emergency ambulance service in Bardoli with modern medical equipment. Serving rural and urban areas.', location: 'Bardoli, Gujarat 394601', latitude: 21.120000, longitude: 73.120000, phone: '+91 2622 2345692', image: 'https://placehold.co/600x400/FF6666/FFFFFF?text=Ambulance+15' },
  
  // Very far (30-50km)
  { title: 'Ahmedabad Express Ambulance', description: 'High-speed ambulance service connecting Surat to Ahmedabad. Long-distance medical transport with ICU facilities.', location: 'Ahmedabad, Gujarat 380001', latitude: 23.022500, longitude: 72.571400, phone: '+91 79 2345693', image: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Ambulance+16' },
  { title: 'Vadodara Medical Transport', description: 'Professional ambulance service in Vadodara. Equipped with life support systems and experienced medical team.', location: 'Vadodara, Gujarat 390001', latitude: 22.307200, longitude: 73.181200, phone: '+91 265 2345694', image: 'https://placehold.co/600x400/CC0000/FFFFFF?text=Ambulance+17' },
  { title: 'Rajkot Emergency Ambulance', description: 'Emergency ambulance service in Rajkot with advanced cardiac care equipment. Available 24/7 for medical emergencies.', location: 'Rajkot, Gujarat 360001', latitude: 22.303900, longitude: 70.802200, phone: '+91 281 2345695', image: 'https://placehold.co/600x400/990000/FFFFFF?text=Ambulance+18' },
  { title: 'Gandhinagar Medical Services', description: 'State capital ambulance service with government-approved facilities. Serving Gandhinagar and surrounding areas.', location: 'Gandhinagar, Gujarat 382010', latitude: 23.215600, longitude: 72.636900, phone: '+91 79 2345696', image: 'https://placehold.co/600x400/FF3333/FFFFFF?text=Ambulance+19' },
  { title: 'Jamnagar Emergency Response', description: 'Coastal city ambulance service with quick response time. Specialized in accident and trauma care.', location: 'Jamnagar, Gujarat 361001', latitude: 22.470700, longitude: 70.058300, phone: '+91 288 2345697', image: 'https://placehold.co/600x400/FF6666/FFFFFF?text=Ambulance+20' },
];

// Doctor data
const doctorData: Array<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>> = [
  // Close to center (within 5km)
  { title: 'Dr. Rajesh Patel - General Physician', description: 'Experienced general physician with 15 years of practice. Specializes in family medicine, diabetes, and hypertension management.', location: 'Amroli Health Center, Amroli, Surat, Gujarat 394105', latitude: 21.244000, longitude: 72.876000, phone: '+91 261 2345701', specialization: 'General Medicine', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Rajesh+Patel' },
  { title: 'Dr. Priya Shah - Cardiologist', description: 'Renowned cardiologist with expertise in heart diseases, angioplasty, and cardiac rehabilitation. Available for consultations and emergency cardiac care.', location: 'Amroli Cardiac Care, Surat, Gujarat 394105', latitude: 21.239000, longitude: 72.875000, phone: '+91 261 2345702', specialization: 'Cardiology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Priya+Shah' },
  { title: 'Dr. Amit Desai - Pediatrician', description: 'Child specialist with 12 years of experience. Expert in treating childhood diseases, vaccinations, and developmental issues.', location: 'Amroli Children Clinic, Surat, Gujarat 394105', latitude: 21.241000, longitude: 72.877000, phone: '+91 261 2345703', specialization: 'Pediatrics', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Amit+Desai' },
  { title: 'Dr. Sneha Mehta - Gynecologist', description: 'Women health specialist providing comprehensive gynecological care, pregnancy care, and family planning services.', location: 'Amroli Women Clinic, Surat, Gujarat 394105', latitude: 21.243000, longitude: 72.879000, phone: '+91 261 2345704', specialization: 'Gynecology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Sneha+Mehta' },
  { title: 'Dr. Vikram Joshi - Orthopedic Surgeon', description: 'Orthopedic specialist with expertise in joint replacement, sports injuries, and fracture treatment. Available for consultations and surgeries.', location: 'Amroli Ortho Center, Surat, Gujarat 394105', latitude: 21.240000, longitude: 72.874000, phone: '+91 261 2345705', specialization: 'Orthopedics', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Vikram+Joshi' },
  
  // Medium distance (5-15km)
  { title: 'Dr. Anjali Gupta - Dermatologist', description: 'Skin specialist with advanced knowledge in cosmetic dermatology, acne treatment, and skin diseases. Modern clinic with latest equipment.', location: 'Adajan Skin Care, Surat, Gujarat 395009', latitude: 21.218000, longitude: 72.852000, phone: '+91 261 2345706', specialization: 'Dermatology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Anjali+Gupta' },
  { title: 'Dr. Manish Agarwal - Neurologist', description: 'Neurologist specializing in brain and nervous system disorders. Expert in treating epilepsy, stroke, and neurological conditions.', location: 'Vesu Neuro Clinic, Surat, Gujarat 395007', latitude: 21.258000, longitude: 72.902000, phone: '+91 261 2345707', specialization: 'Neurology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Manish+Agarwal' },
  { title: 'Dr. Kavita Reddy - Ophthalmologist', description: 'Eye specialist with expertise in cataract surgery, LASIK, and retinal diseases. Modern eye care facility with advanced equipment.', location: 'Piplod Eye Care, Surat, Gujarat 395007', latitude: 21.252000, longitude: 72.848000, phone: '+91 261 2345708', specialization: 'Ophthalmology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Kavita+Reddy' },
  { title: 'Dr. Rohan Malhotra - ENT Specialist', description: 'Ear, Nose, and Throat specialist with 10 years of experience. Treats sinusitis, hearing problems, and throat disorders.', location: 'Varachha ENT Clinic, Surat, Gujarat 395006', latitude: 21.228000, longitude: 72.898000, phone: '+91 261 2345709', specialization: 'ENT', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Rohan+Malhotra' },
  { title: 'Dr. Neha Kapoor - Psychiatrist', description: 'Mental health specialist providing counseling and treatment for depression, anxiety, and psychological disorders. Confidential consultations available.', location: 'Katargam Mental Health Center, Surat, Gujarat 395004', latitude: 21.212000, longitude: 72.872000, phone: '+91 261 2345710', specialization: 'Psychiatry', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Neha+Kapoor' },
  
  // Far distance (15-30km)
  { title: 'Dr. Suresh Iyer - Gastroenterologist', description: 'Digestive system specialist with expertise in endoscopy, liver diseases, and gastrointestinal disorders. Advanced diagnostic facilities available.', location: 'Bharuch Gastro Center, Bharuch, Gujarat 392001', latitude: 21.702000, longitude: 72.952000, phone: '+91 2642 2345711', specialization: 'Gastroenterology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Suresh+Iyer' },
  { title: 'Dr. Meera Nair - Pulmonologist', description: 'Lung specialist treating asthma, COPD, and respiratory diseases. Expert in critical care and ventilator management.', location: 'Navsari Respiratory Care, Navsari, Gujarat 396445', latitude: 20.952000, longitude: 72.922000, phone: '+91 2637 2345712', specialization: 'Pulmonology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Meera+Nair' },
  { title: 'Dr. Arjun Singh - Urologist', description: 'Urinary system and kidney specialist. Expert in kidney stones, prostate problems, and urological surgeries.', location: 'Valsad Urology Clinic, Valsad, Gujarat 396001', latitude: 20.602000, longitude: 72.932000, phone: '+91 2632 2345713', specialization: 'Urology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Arjun+Singh' },
  { title: 'Dr. Pooja Sharma - Endocrinologist', description: 'Hormone specialist treating diabetes, thyroid disorders, and metabolic conditions. Comprehensive diabetes management program available.', location: 'Ankleshwar Endocrine Center, Ankleshwar, Gujarat 393002', latitude: 21.602000, longitude: 72.982000, phone: '+91 2646 2345714', specialization: 'Endocrinology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Pooja+Sharma' },
  { title: 'Dr. Rahul Verma - Oncologist', description: 'Cancer specialist providing chemotherapy, radiation therapy, and cancer care. Compassionate treatment with modern cancer care facilities.', location: 'Bardoli Cancer Care, Bardoli, Gujarat 394601', latitude: 21.122000, longitude: 73.122000, phone: '+91 2622 2345715', specialization: 'Oncology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Rahul+Verma' },
  
  // Very far (30-50km)
  { title: 'Dr. Sunita Rao - Rheumatologist', description: 'Joint and autoimmune disease specialist. Expert in treating arthritis, lupus, and rheumatic conditions.', location: 'Ahmedabad Rheumatology Center, Ahmedabad, Gujarat 380001', latitude: 23.024500, longitude: 72.573400, phone: '+91 79 2345716', specialization: 'Rheumatology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Sunita+Rao' },
  { title: 'Dr. Karan Thakkar - Nephrologist', description: 'Kidney specialist with expertise in dialysis, kidney transplantation, and chronic kidney disease management.', location: 'Vadodara Kidney Care, Vadodara, Gujarat 390001', latitude: 22.309200, longitude: 73.183200, phone: '+91 265 2345717', specialization: 'Nephrology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Karan+Thakkar' },
  { title: 'Dr. Divya Menon - Anesthesiologist', description: 'Anesthesia specialist providing pain management and surgical anesthesia services. Expert in critical care anesthesia.', location: 'Rajkot Anesthesia Services, Rajkot, Gujarat 360001', latitude: 22.305900, longitude: 70.804200, phone: '+91 281 2345718', specialization: 'Anesthesiology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Divya+Menon' },
  { title: 'Dr. Aditya Nair - Plastic Surgeon', description: 'Cosmetic and reconstructive surgery specialist. Expert in facelifts, breast augmentation, and burn reconstruction.', location: 'Gandhinagar Plastic Surgery, Gandhinagar, Gujarat 382010', latitude: 23.217600, longitude: 72.638900, phone: '+91 79 2345719', specialization: 'Plastic Surgery', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Aditya+Nair' },
  { title: 'Dr. Ishita Patel - Pathologist', description: 'Laboratory medicine specialist providing diagnostic services, blood tests, and pathology consultations. Advanced lab facilities available.', location: 'Jamnagar Pathology Lab, Jamnagar, Gujarat 361001', latitude: 22.472700, longitude: 70.060300, phone: '+91 288 2345720', specialization: 'Pathology', image: 'https://placehold.co/600x400/0066CC/FFFFFF?text=Dr.+Ishita+Patel' },
];

// Generate additional random entries to reach 50 total
function generateRandomAmbulances(count: number): Array<Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>> {
  const ambulanceNames = [
    'Emergency Response Ambulance', 'Life Saver Ambulance', 'Quick Response Medical', 'Critical Care Transport',
    'Emergency Medical Services', 'Rapid Response Team', 'Medical Emergency Unit', 'Ambulance Express',
    'Emergency Care Services', 'Medical Transport Network', 'Emergency Response Unit', 'Life Support Ambulance',
    'Critical Care Ambulance', 'Emergency Medical Transport', 'Rapid Medical Response'
  ];
  
  const locations = [
    'Surat', 'Bharuch', 'Navsari', 'Valsad', 'Ankleshwar', 'Bardoli', 'Vyara', 'Songadh',
    'Olpad', 'Kamrej', 'Palsana', 'Mangrol', 'Bulsar', 'Daman', 'Silvassa'
  ];
  
  const entries: Array<Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>> = [];
  
  for (let i = 0; i < count; i++) {
    const name = ambulanceNames[Math.floor(Math.random() * ambulanceNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const radius = Math.random() * 50; // Random distance up to 50km
    const coords = generateRandomCoordinates(CENTER_LAT, CENTER_LON, radius);
    
    entries.push({
      title: `${name} ${i + 21}`,
      description: `Professional ambulance service in ${location}. Available 24/7 for medical emergencies with trained paramedics and modern equipment.`,
      location: `${location}, Gujarat, India`,
      latitude: coords.lat,
      longitude: coords.lon,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      image: `https://placehold.co/600x400/FF${Math.floor(Math.random() * 1000000).toString(16).padStart(6, '0')}/FFFFFF?text=Ambulance+${i + 21}`
    });
  }
  
  return entries;
}

function generateRandomDoctors(count: number): Array<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>> {
  const firstNames = ['Raj', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Manish', 'Kavita', 'Rohan', 'Neha',
    'Suresh', 'Meera', 'Arjun', 'Pooja', 'Rahul', 'Sunita', 'Karan', 'Divya', 'Aditya', 'Ishita',
    'Nikhil', 'Shreya', 'Ravi', 'Anita', 'Deepak', 'Maya', 'Siddharth', 'Radha', 'Gaurav', 'Kiran'];
  
  const lastNames = ['Patel', 'Shah', 'Desai', 'Mehta', 'Joshi', 'Gupta', 'Agarwal', 'Reddy', 'Malhotra', 'Kapoor',
    'Iyer', 'Nair', 'Singh', 'Sharma', 'Verma', 'Rao', 'Thakkar', 'Menon', 'Kumar', 'Pandey'];
  
  const specializations = [
    'General Medicine', 'Cardiology', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Dermatology',
    'Neurology', 'Ophthalmology', 'ENT', 'Psychiatry', 'Gastroenterology', 'Pulmonology',
    'Urology', 'Endocrinology', 'Oncology', 'Rheumatology', 'Nephrology', 'Anesthesiology',
    'Plastic Surgery', 'Pathology', 'Radiology', 'Surgery', 'Internal Medicine', 'Family Medicine'
  ];
  
  const locations = [
    'Surat', 'Bharuch', 'Navsari', 'Valsad', 'Ankleshwar', 'Bardoli', 'Vyara', 'Songadh',
    'Olpad', 'Kamrej', 'Palsana', 'Mangrol', 'Bulsar', 'Daman', 'Silvassa'
  ];
  
  const entries: Array<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>> = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const radius = Math.random() * 50; // Random distance up to 50km
    const coords = generateRandomCoordinates(CENTER_LAT, CENTER_LON, radius);
    
    entries.push({
      title: `Dr. ${firstName} ${lastName} - ${specialization}`,
      description: `Experienced ${specialization.toLowerCase()} specialist with years of practice. Providing quality healthcare services in ${location} with modern medical facilities.`,
      location: `${location} Medical Center, ${location}, Gujarat, India`,
      latitude: coords.lat,
      longitude: coords.lon,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      specialization: specialization,
      image: `https://placehold.co/600x400/0066${Math.floor(Math.random() * 1000000).toString(16).padStart(4, '0')}/FFFFFF?text=Dr.+${firstName}+${lastName}`
    });
  }
  
  return entries;
}

// Seed function
function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    db.prepare('DELETE FROM ambulances').run();
    db.prepare('DELETE FROM doctors').run();
    console.log('Cleared existing data');
    
    // Insert ambulances
    const ambulanceStmt = db.prepare(`
      INSERT INTO ambulances (title, description, location, latitude, longitude, phone, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const allAmbulances = [...ambulanceData, ...generateRandomAmbulances(5)];
    console.log(`Inserting ${allAmbulances.length} ambulances...`);
    
    for (const ambulance of allAmbulances) {
      ambulanceStmt.run(
        ambulance.title,
        ambulance.description,
        ambulance.location,
        ambulance.latitude,
        ambulance.longitude,
        ambulance.phone || null,
        ambulance.image || null
      );
    }
    
    console.log('✓ Ambulances inserted');
    
    // Insert doctors
    const doctorStmt = db.prepare(`
      INSERT INTO doctors (title, description, location, latitude, longitude, phone, specialization, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const allDoctors = [...doctorData, ...generateRandomDoctors(5)];
    console.log(`Inserting ${allDoctors.length} doctors...`);
    
    for (const doctor of allDoctors) {
      doctorStmt.run(
        doctor.title,
        doctor.description,
        doctor.location,
        doctor.latitude,
        doctor.longitude,
        doctor.phone || null,
        doctor.specialization || null,
        doctor.image || null
      );
    }
    
    console.log('✓ Doctors inserted');
    
    // Get counts
    const ambulanceCount = db.prepare('SELECT COUNT(*) as count FROM ambulances').get() as { count: number };
    const doctorCount = db.prepare('SELECT COUNT(*) as count FROM doctors').get() as { count: number };
    
    console.log('\n✅ Database seeding completed!');
    console.log(`Total ambulances: ${ambulanceCount.count}`);
    console.log(`Total doctors: ${doctorCount.count}`);
    console.log(`Total entries: ${ambulanceCount.count + doctorCount.count}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    process.exit();
  }
}

// Run seed
seedDatabase();

