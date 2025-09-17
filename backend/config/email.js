const emailConfig = {
  emailjs: {
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    confirmationTemplateId: process.env.EMAILJS_CONFIRMATION_TEMPLATE_ID,
  },

  project: {
    name: 'Microcuencas',
    email: process.env.PROJECT_EMAIL || 'lop22716@uvg.edu.gt', // Únicamente de test atte. Xavier
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME || 'Proyecto de Microcuencas',
    university: 'Universidad del Valle de Guatemala',
  },

  settings: {
    enableConfirmation: process.env.ENABLE_CONFIRMATION !== 'false',
    timezone: 'America/Guatemala',
    maxMessageLength: 5000,
  },
};

const requiredFields = [
  'emailjs.publicKey',
  'emailjs.privateKey',
  'emailjs.serviceId',
  'emailjs.templateId',
  'project.email',
];

const validateConfig = () => {
  const missing = requiredFields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], emailConfig);
    return !value;
  });

  if (missing.length > 0) {
    throw new Error(`Configuración de email faltante: ${missing.join(', ')}`);
  }
};

export { emailConfig, validateConfig };