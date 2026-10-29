import type { Idioma } from "@/lib/idiomas";

/* La política de tratamiento de datos personales que exigen la Ley 1581 de
   2012 y el Decreto 1074 de 2015 (capítulo 25, antes Decreto 1377 de 2013).

   AI Safety Colombia no tiene personería jurídica, así que ante la ley el
   responsable de los datos es Jose como persona natural. La versión es la
   fecha en que entró a regir el texto: los formularios la guardan junto con
   la hora en que la persona marcó la casilla, que es la prueba de la
   autorización que pide el artículo 2.2.2.25.2.5. Si el texto cambia en algo
   que toque finalidades, datos o destinatarios, se cambia la versión y se
   avisa a quienes ya dieron sus datos. */
export const POLITICA_VERSION = "2026-10-09";

export const RUTA_POLITICA: Record<Idioma, string> = {
  es: "/privacidad",
  en: "/en/privacy",
  pt: "/pt/privacidade",
};

export const CORREO_DATOS = "equipo@aisafetycolombia.org";

/* Un bloque es un párrafo o, si es una lista, sus puntos. Dentro del texto,
   **así** va en negrita y [así](/ruta) es un enlace. */
export type Bloque = string | string[];

export type TextosPolitica = {
  kicker: string;
  titulo: string;
  entrada: string;
  /* La línea de versión del encabezado, el título del índice y la ficha del
     responsable que abre la primera sección. */
  vigencia: string;
  indice: string;
  ficha: { etiqueta: string; valor: string }[];
  /* ficha: la sección del responsable, que lleva debajo la ficha con sus datos. */
  secciones: { titulo: string; bloques: Bloque[]; ficha?: boolean }[];
  /* Lo que va junto a la casilla de los formularios y el enlace a esta página. */
  casilla: string;
  casillaEnlace: string;
  casillaFalta: string;
  /* El nombre del pie y del resumen de faltantes. */
  enlacePie: string;
  faltaCasilla: string;
};

export const TEXTOS_POLITICA: Record<Idioma, TextosPolitica> = {
  es: {
    kicker: "Datos personales",
    titulo: "Política de tratamiento de datos personales",
    entrada:
      "Cuando aplicas, te inscribes o te nominan a una de nuestras actividades, nos das datos tuyos. Este documento explica quién los guarda, para qué y cómo pedir que los corrijamos o los borremos.",
    vigencia: "Versión 2026-10-09 · Vigente desde el 9 de octubre de 2026 · Ley 1581 de 2012 y Decreto 1074 de 2015",
    indice: "Contenido",
    ficha: [
      { etiqueta: "Responsable", valor: "Jose Angel Gelves Cabrera" },
      { etiqueta: "Naturaleza", valor: "Persona natural" },
      { etiqueta: "Domicilio", valor: "Bogotá, Colombia" },
      { etiqueta: "Canal de atención", valor: "equipo@aisafetycolombia.org" },
    ],
    secciones: [
      {
        titulo: "Autorización",
        bloques: [
          "Al marcar la casilla de autorización en cualquiera de nuestros formularios, el titular declara lo siguiente:",
          "En virtud de los artículos 9 y 12 de la Ley 1581 de 2012, autorizo a AI Safety Colombia para que recolecte, almacene, use, actualice, organice y, cuando haga falta, comparta con los encargados descritos en esta política mis datos personales, de forma total o parcial, con las finalidades que esta política describe: revisar mi aplicación, organizar la actividad y escribirme por correo sobre ella y sobre otras actividades de AI Safety Colombia, como eventos, convocatorias, resultados de nominaciones y nuevas publicaciones.",
          "Declaro que conozco los derechos que me asisten como titular, consagrados en el artículo 8 de la Ley 1581 de 2012, y doy mi consentimiento previo, expreso e informado.",
          "Esta autorización rige mientras se cumplan esas finalidades y se puede revocar en cualquier momento, como explica la [sección de derechos del titular](#seccion-10).",
        ],
      },
      {
        titulo: "Responsable del tratamiento",
        ficha: true,
        bloques: [
          "AI Safety Colombia es una comunidad sin personería jurídica. Por eso el responsable del tratamiento de los datos es **Jose Angel Gelves Cabrera**, persona natural que la coordina, con domicilio en Bogotá, Colombia.",
          "Para todo lo que tenga que ver con tus datos, escribe a **equipo@aisafetycolombia.org**. Por ese canal se atienden las consultas y los reclamos.",
        ],
      },
      {
        titulo: "Datos que recolectamos",
        bloques: [
          "Solo los que pide cada formulario, y nada más:",
          [
            "**Identificación y contacto:** nombre, apellido, correo y, en el sprint, número de WhatsApp.",
            "**Perfil:** enlace a LinkedIn, Google Scholar o tu hoja de vida, área de estudio, etapa de carrera y afiliación.",
            "**Tus respuestas:** lo que escribes sobre tu motivación, tu experiencia, tu disponibilidad y cómo supiste de nosotros.",
            "**Datos de otras personas:** el nombre y el correo de alguien a quien nominas, o los nombres de tu equipo.",
            "**Logística:** dónde te vas a quedar, restricciones de alimentación o necesidades de accesibilidad, si decides contarlas.",
            "**Prueba de tu autorización:** la fecha y la hora en que marcaste la casilla y la versión de esta política que aceptaste.",
          ],
          "No pedimos tu número de documento, tu edad, tu género, tu origen étnico ni tu dirección.",
        ],
      },
      {
        titulo: "Finalidades del tratamiento",
        bloques: [
          [
            "Revisar tu aplicación y decidir quién entra a cada cohorte, sprint o actividad.",
            "Escribirte sobre la actividad a la que aplicaste: resultado, horarios, materiales, cambios y certificado.",
            "Organizar la logística: armar grupos y equipos, conseguir hospedaje, prever comida y accesibilidad.",
            "Invitarte a futuras actividades de AI Safety Colombia que tengan que ver con lo que nos contaste. Puedes pedir que no te escribamos más en cualquier momento.",
            "Medir el resultado de nuestros programas y contárselo a quienes nos financian, siempre en cifras agregadas que no te identifican.",
          ],
          "No vendemos tus datos ni los usamos para publicidad.",
        ],
      },
      {
        titulo: "Datos sensibles y datos de menores",
        bloques: [
          "La información sobre tu salud, como una alergia o una necesidad de accesibilidad, es un dato sensible. Nunca es obligatoria: no tienes que darla para aplicar ni para participar. Si nos la das, la usamos solo para que la actividad te funcione y solo la ven quienes organizan.",
          "Nuestros programas son para personas mayores de 18 años. Si eres menor de edad, tu madre, tu padre o tu representante legal tiene que autorizar el tratamiento de tus datos antes de que apliques; escríbenos y lo resolvemos con ellos.",
        ],
      },
      {
        titulo: "Datos de personas nominadas",
        bloques: [
          "Cuando nos das el nombre y el correo de otra persona, declaras que le contaste que lo ibas a hacer y que estuvo de acuerdo. Le escribimos una sola vez para invitarla, le decimos quién la nominó si nos diste permiso y le explicamos cómo pedir que borremos su correo. Si no aplica en los 60 días siguientes, lo borramos.",
        ],
      },
      {
        titulo: "Información visible para otros participantes",
        bloques: [
          "Si eres seleccionado para un sprint, los demás participantes pueden ver tu nombre, tu afiliación, tu LinkedIn y en qué piensas trabajar, para que puedan formar equipos. Tu correo, tu WhatsApp y tus respuestas sobre logística y salud nunca se publican.",
          "El nombre y la foto de quienes forman el equipo, los mentores y los ponentes aparecen en el sitio con su permiso.",
        ],
      },
      {
        titulo: "Encargados y transferencia internacional",
        bloques: [
          "Tus datos los ven solo quienes organizan la actividad a la que aplicaste. Además, los guardan y procesan por nuestra cuenta estos proveedores, que están en Estados Unidos, un país que la Superintendencia de Industria y Comercio reconoce con un nivel adecuado de protección (Circular Externa 005 de 2017, con los criterios que reitera la Circular Externa 002 de 2025):",
          [
            "**Supabase:** la base de datos donde quedan las aplicaciones.",
            "**Vercel:** el servidor del sitio y su analítica.",
            "**Resend:** el envío de los correos de confirmación.",
            "**Google:** el correo, el calendario y los documentos de trabajo del equipo.",
          ],
          "En los sprints que hacemos con **Apart Research**, que organiza el evento global, compartimos con ellos el nombre, el correo y el perfil de quienes confirman su asistencia, para inscribirlos. Los eventos se registran en **Luma** y la comunidad se reúne en **WhatsApp**; esos servicios tienen sus propias políticas.",
        ],
      },
      {
        titulo: "Conservación de los datos",
        bloques: [
          "Guardamos los datos de una aplicación hasta tres años después de la actividad, para medir el resultado de los programas y para tenerte en cuenta en las siguientes. Pasado ese tiempo los borramos o los dejamos anónimos. Los correos de personas nominadas que no aplican se borran a los 60 días.",
        ],
      },
      {
        titulo: "Derechos del titular",
        bloques: [
          "Como titular de los datos tienes derecho a:",
          [
            "Saber qué datos tuyos tenemos, actualizarlos y corregirlos.",
            "Pedir prueba de la autorización que nos diste.",
            "Saber para qué los hemos usado.",
            "Revocar la autorización y pedir que los borremos, salvo que tengamos el deber legal de guardarlos.",
            "Consultarlos gratis.",
            "Presentar una queja ante la Superintendencia de Industria y Comercio, después de haber hecho tu consulta o tu reclamo ante nosotros.",
          ],
        ],
      },
      {
        titulo: "Procedimiento para consultas y reclamos",
        bloques: [
          "Escribe a **equipo@aisafetycolombia.org** desde el correo con el que nos diste tus datos, con tu nombre, lo que pides y, si es un reclamo, los hechos y cualquier documento que lo sustente.",
          [
            "**Consultas** (qué datos tenemos y cómo los usamos): respondemos en un máximo de 10 días hábiles. Si no alcanzamos, te avisamos antes y respondemos en máximo 5 días hábiles más.",
            "**Reclamos** (corrección, actualización, supresión o revocatoria): respondemos en un máximo de 15 días hábiles. Si no alcanzamos, te avisamos antes y respondemos en máximo 8 días hábiles más. Si al reclamo le falta información, te la pedimos en los 5 días siguientes; si no la recibimos en dos meses, entendemos que desististe.",
          ],
        ],
      },
      {
        titulo: "Cookies y analítica",
        bloques: [
          "El sitio no usa cookies. Medimos las visitas con Vercel Web Analytics, que cuenta páginas vistas sin cookies y sin identificar a nadie. Los formularios guardan un borrador en tu propio navegador para que no pierdas lo que llevas; se borra al enviar y nunca nos llega. Las imágenes de algunos eventos se cargan desde los servidores de Luma.",
        ],
      },
      {
        titulo: "Seguridad de la información",
        bloques: [
          "Las aplicaciones quedan en una base de datos cerrada al público, a la que solo se entra con una llave del servidor. Solo quienes organizan cada actividad tienen acceso, y solo a lo que necesitan.",
        ],
      },
      {
        titulo: "Vigencia y modificaciones",
        bloques: [
          "Esta política rige desde el 9 de octubre de 2026 y las bases de datos estarán vigentes mientras AI Safety Colombia funcione. Si la cambiamos en algo importante, como una finalidad nueva o un nuevo destinatario, lo publicamos acá y se lo avisamos por correo a quienes nos han dado sus datos.",
          "Si vives en Brasil, también tienes los derechos de la Ley 13.709 de 2018 (LGPD) y los atendemos por el mismo canal.",
        ],
      },
    ],
    casilla:
      "De forma previa, expresa e informada, y conforme a los artículos 9 y 12 de la Ley 1581 de 2012, autorizo a AI Safety Colombia a tratar mis datos para revisar mi aplicación, organizar la actividad y escribirme sobre ella y sobre sus otras actividades. Conozco mis derechos como titular (artículo 8 de esa ley), explicados en la ",
    casillaEnlace: "política de tratamiento de datos",
    casillaFalta: "Para enviar tu aplicación tienes que autorizar el tratamiento de tus datos.",
    enlacePie: "Política de datos personales",
    faltaCasilla: "La autorización de tus datos",
  },

  en: {
    kicker: "Personal data",
    titulo: "Personal data policy",
    entrada:
      "When you apply, sign up or are nominated for one of our activities, you give us data about yourself. This document explains who keeps it, what for and how to ask us to correct or delete it.",
    vigencia: "Version 2026-10-09 · In force since 9 October 2026 · Colombian Law 1581 of 2012 and Decree 1074 of 2015",
    indice: "Contents",
    ficha: [
      { etiqueta: "Controller", valor: "Jose Angel Gelves Cabrera" },
      { etiqueta: "Status", valor: "Natural person" },
      { etiqueta: "Domicile", valor: "Bogotá, Colombia" },
      { etiqueta: "Contact", valor: "equipo@aisafetycolombia.org" },
    ],
    secciones: [
      {
        titulo: "Authorisation",
        bloques: [
          "By ticking the authorisation box on any of our forms, the data subject declares the following:",
          "Under articles 9 and 12 of Colombian Law 1581 of 2012, I authorise AI Safety Colombia to collect, store, use, update, organise and, where needed, share with the processors described in this policy my personal data, in whole or in part, for the purposes this policy describes: reviewing my application, organising the activity and emailing me about it and about other AI Safety Colombia activities, such as events, calls for applications, nomination results and new publications.",
          "I declare that I know my rights as a data subject under article 8 of Law 1581 of 2012, and I give my prior, express and informed consent.",
          "This authorisation lasts as long as those purposes apply and can be revoked at any time, as explained in the [section on the data subject's rights](#seccion-10).",
        ],
      },
      {
        titulo: "Data controller",
        ficha: true,
        bloques: [
          "AI Safety Colombia is a community without legal personhood. That is why the data controller is **Jose Angel Gelves Cabrera**, the individual who coordinates it, domiciled in Bogotá, Colombia.",
          "For anything to do with your data, write to **equipo@aisafetycolombia.org**. Enquiries and complaints are handled through that address.",
        ],
      },
      {
        titulo: "Data we collect",
        bloques: [
          "Only what each form asks for, and nothing else:",
          [
            "**Identification and contact:** first name, last name, email and, for the sprint, WhatsApp number.",
            "**Profile:** a link to LinkedIn, Google Scholar or your CV, field of study, career stage and affiliation.",
            "**Your answers:** what you write about your motivation, experience, availability and how you heard about us.",
            "**Other people's data:** the name and email of someone you nominate, or the names of your team.",
            "**Logistics:** where you will stay, dietary restrictions or accessibility needs, if you choose to share them.",
            "**Proof of your authorisation:** the date and time you ticked the box and the version of this policy you accepted.",
          ],
          "We don't ask for your ID number, age, gender, ethnicity or address.",
        ],
      },
      {
        titulo: "Purposes of processing",
        bloques: [
          [
            "Reviewing your application and deciding who joins each cohort, sprint or activity.",
            "Writing to you about the activity you applied to: outcome, schedules, materials, changes and certificate.",
            "Organising logistics: forming groups and teams, arranging lodging, planning food and accessibility.",
            "Inviting you to future AI Safety Colombia activities related to what you told us. You can ask us to stop at any time.",
            "Measuring the results of our programmes and reporting them to our funders, always as aggregate figures that don't identify you.",
          ],
          "We don't sell your data or use it for advertising.",
        ],
      },
      {
        titulo: "Sensitive data and minors",
        bloques: [
          "Information about your health, such as an allergy or an accessibility need, is sensitive data. It is never required: you don't have to give it to apply or to take part. If you do, we use it only to make the activity work for you, and only the organisers see it.",
          "Our programmes are for people over 18. If you are a minor, your parent or legal guardian must authorise the processing of your data before you apply; write to us and we'll sort it out with them.",
        ],
      },
      {
        titulo: "Data about people you nominate",
        bloques: [
          "When you give us another person's name and email, you confirm that you told them you would and that they agreed. We write to them once to invite them, tell them who nominated them if you allowed it, and explain how to ask us to delete their email. If they don't apply within 60 days, we delete it.",
        ],
      },
      {
        titulo: "Information visible to other participants",
        bloques: [
          "If you are selected for a sprint, the other participants can see your name, affiliation, LinkedIn and what you plan to work on, so they can form teams. Your email, WhatsApp and your answers about logistics and health are never published.",
          "The names and photos of the team, mentors and speakers appear on the site with their permission.",
        ],
      },
      {
        titulo: "Processors and international transfers",
        bloques: [
          "Your data is seen only by the people organising the activity you applied to. It is also stored and processed on our behalf by these providers, located in the United States, a country Colombia's Superintendence of Industry and Commerce recognises as having an adequate level of protection (External Circular 005 of 2017, with the criteria restated in External Circular 002 of 2025):",
          [
            "**Supabase:** the database where applications are kept.",
            "**Vercel:** the site's server and its analytics.",
            "**Resend:** sending confirmation emails.",
            "**Google:** the team's email, calendar and working documents.",
          ],
          "For sprints we run with **Apart Research**, which organises the global event, we share the name, email and profile of those who confirm attendance so they can be registered. Events are registered on **Luma** and the community meets on **WhatsApp**; those services have their own policies.",
        ],
      },
      {
        titulo: "Retention",
        bloques: [
          "We keep application data for up to three years after the activity, to measure the results of our programmes and to consider you for future ones. After that we delete or anonymise it. Emails of nominees who don't apply are deleted after 60 days.",
        ],
      },
      {
        titulo: "Your rights as data subject",
        bloques: [
          "As the owner of the data you have the right to:",
          [
            "Know what data we hold about you, update it and correct it.",
            "Ask for proof of the authorisation you gave us.",
            "Know what we have used it for.",
            "Withdraw your authorisation and ask us to delete it, unless we are legally required to keep it.",
            "Access it free of charge.",
            "File a complaint with Colombia's Superintendence of Industry and Commerce, after first making your enquiry or complaint to us.",
          ],
        ],
      },
      {
        titulo: "Procedure for enquiries and complaints",
        bloques: [
          "Write to **equipo@aisafetycolombia.org** from the email you gave us, with your name, what you are asking for and, if it is a complaint, the facts and any supporting documents.",
          [
            "**Enquiries** (what data we hold and how we use it): we reply within 10 business days at most. If we can't, we let you know beforehand and reply within 5 more business days at most.",
            "**Complaints** (correction, update, deletion or withdrawal): we reply within 15 business days at most. If we can't, we let you know beforehand and reply within 8 more business days at most. If a complaint is missing information, we ask for it within the next 5 days; if we don't receive it within two months, we consider it withdrawn.",
          ],
        ],
      },
      {
        titulo: "Cookies and analytics",
        bloques: [
          "The site doesn't use cookies. We measure visits with Vercel Web Analytics, which counts page views without cookies and without identifying anyone. Forms save a draft in your own browser so you don't lose your progress; it is deleted when you submit and never reaches us. Images for some events load from Luma's servers.",
        ],
      },
      {
        titulo: "Information security",
        bloques: [
          "Applications are kept in a database closed to the public, which can only be accessed with a server key. Only the people organising each activity have access, and only to what they need.",
        ],
      },
      {
        titulo: "Effective date and changes",
        bloques: [
          "This policy applies from 9 October 2026 and the databases will remain in force for as long as AI Safety Colombia operates. If we change it in any important way, such as a new purpose or a new recipient, we will publish it here and email the people who have given us their data.",
          "If you live in Brazil, you also have the rights under Law 13.709 of 2018 (LGPD), and we handle them through the same channel.",
        ],
      },
    ],
    casilla:
      "Under articles 9 and 12 of Colombian Law 1581 of 2012, I give my prior, express and informed authorisation for AI Safety Colombia to process my data to review my application, organise the activity and write to me about it and about its other activities. I know my rights as a data subject (article 8 of that law), explained in the ",
    casillaEnlace: "personal data policy",
    casillaFalta: "To submit your application you need to authorise the processing of your data.",
    enlacePie: "Personal data policy",
    faltaCasilla: "Authorisation of your data",
  },

  pt: {
    kicker: "Dados pessoais",
    titulo: "Política de tratamento de dados pessoais",
    entrada:
      "Quando você se inscreve ou é indicado para uma de nossas atividades, nos passa dados seus. Este documento explica quem os guarda, para quê e como pedir que os corrijamos ou apaguemos.",
    vigencia: "Versão 2026-10-09 · Em vigor desde 9 de outubro de 2026 · Lei 1581 de 2012 e Decreto 1074 de 2015 da Colômbia",
    indice: "Conteúdo",
    ficha: [
      { etiqueta: "Responsável", valor: "Jose Angel Gelves Cabrera" },
      { etiqueta: "Natureza", valor: "Pessoa física" },
      { etiqueta: "Domicílio", valor: "Bogotá, Colômbia" },
      { etiqueta: "Canal de atendimento", valor: "equipo@aisafetycolombia.org" },
    ],
    secciones: [
      {
        titulo: "Autorização",
        bloques: [
          "Ao marcar a caixa de autorização em qualquer um dos nossos formulários, o titular declara o seguinte:",
          "Nos termos dos artigos 9 e 12 da Lei 1581 de 2012 da Colômbia, autorizo a AI Safety Colombia a coletar, armazenar, usar, atualizar, organizar e, quando necessário, compartilhar com os operadores descritos nesta política meus dados pessoais, total ou parcialmente, para as finalidades que esta política descreve: avaliar minha inscrição, organizar a atividade e me escrever por e-mail sobre ela e sobre outras atividades da AI Safety Colombia, como eventos, chamadas, resultados de indicações e novas publicações.",
          "Declaro que conheço os direitos que tenho como titular, previstos no artigo 8 da Lei 1581 de 2012, e dou meu consentimento prévio, expresso e informado.",
          "Esta autorização vale enquanto essas finalidades se aplicarem e pode ser revogada a qualquer momento, como explica a [seção de direitos do titular](#seccion-10).",
        ],
      },
      {
        titulo: "Responsável pelo tratamento",
        ficha: true,
        bloques: [
          "A AI Safety Colombia é uma comunidade sem personalidade jurídica. Por isso o controlador dos dados é **Jose Angel Gelves Cabrera**, pessoa física que a coordena, com domicílio em Bogotá, Colômbia.",
          "Para qualquer assunto sobre seus dados, escreva para **equipo@aisafetycolombia.org**. As consultas e reclamações são atendidas por esse canal.",
        ],
      },
      {
        titulo: "Dados que coletamos",
        bloques: [
          "Só os que cada formulário pede, e nada mais:",
          [
            "**Identificação e contato:** nome, sobrenome, e-mail e, no sprint, número de WhatsApp.",
            "**Perfil:** link do LinkedIn, Google Scholar ou currículo, área de estudo, etapa da carreira e afiliação.",
            "**Suas respostas:** o que você escreve sobre sua motivação, experiência, disponibilidade e como soube de nós.",
            "**Dados de outras pessoas:** o nome e o e-mail de alguém que você indica, ou os nomes da sua equipe.",
            "**Logística:** onde você vai ficar, restrições alimentares ou necessidades de acessibilidade, se decidir contar.",
            "**Prova da sua autorização:** a data e a hora em que você marcou a caixa e a versão desta política que aceitou.",
          ],
          "Não pedimos seu número de documento, idade, gênero, origem étnica nem endereço.",
        ],
      },
      {
        titulo: "Finalidades do tratamento",
        bloques: [
          [
            "Avaliar sua inscrição e decidir quem entra em cada turma, sprint ou atividade.",
            "Escrever para você sobre a atividade em que se inscreveu: resultado, horários, materiais, mudanças e certificado.",
            "Organizar a logística: montar grupos e equipes, conseguir hospedagem, prever comida e acessibilidade.",
            "Convidar você para futuras atividades da AI Safety Colombia relacionadas ao que nos contou. Você pode pedir que não escrevamos mais a qualquer momento.",
            "Medir o resultado dos nossos programas e reportá-lo a quem nos financia, sempre em números agregados que não identificam você.",
          ],
          "Não vendemos seus dados nem os usamos para publicidade.",
        ],
      },
      {
        titulo: "Dados sensíveis e de menores",
        bloques: [
          "Informações sobre sua saúde, como uma alergia ou uma necessidade de acessibilidade, são dados sensíveis. Nunca são obrigatórias: você não precisa informá-las para se inscrever nem para participar. Se informar, usamos só para que a atividade funcione para você, e só a organização as vê.",
          "Nossos programas são para maiores de 18 anos. Se você for menor de idade, sua mãe, seu pai ou seu representante legal precisa autorizar o tratamento dos seus dados antes da inscrição; escreva para nós e resolvemos com eles.",
        ],
      },
      {
        titulo: "Dados de pessoas indicadas",
        bloques: [
          "Quando nos passa o nome e o e-mail de outra pessoa, você declara que contou a ela que faria isso e que ela concordou. Escrevemos uma única vez para convidá-la, dizemos quem a indicou se você permitiu e explicamos como pedir que apaguemos o e-mail dela. Se ela não se inscrever em 60 dias, apagamos.",
        ],
      },
      {
        titulo: "Informações visíveis para outros participantes",
        bloques: [
          "Se você for selecionado para um sprint, os demais participantes podem ver seu nome, sua afiliação, seu LinkedIn e no que pretende trabalhar, para formar equipes. Seu e-mail, seu WhatsApp e suas respostas sobre logística e saúde nunca são publicados.",
          "O nome e a foto da equipe, dos mentores e dos palestrantes aparecem no site com a permissão deles.",
        ],
      },
      {
        titulo: "Operadores e transferência internacional",
        bloques: [
          "Seus dados são vistos só por quem organiza a atividade em que você se inscreveu. Além disso, são guardados e processados em nosso nome por estes fornecedores, nos Estados Unidos, país que a Superintendência de Indústria e Comércio da Colômbia reconhece com nível adequado de proteção (Circular Externa 005 de 2017, com os critérios reiterados na Circular Externa 002 de 2025):",
          [
            "**Supabase:** o banco de dados onde ficam as inscrições.",
            "**Vercel:** o servidor do site e sua análise de visitas.",
            "**Resend:** o envio dos e-mails de confirmação.",
            "**Google:** o e-mail, a agenda e os documentos de trabalho da equipe.",
          ],
          "Nos sprints que fazemos com a **Apart Research**, que organiza o evento global, compartilhamos com ela o nome, o e-mail e o perfil de quem confirma presença, para fazer a inscrição. Os eventos são registrados no **Luma** e a comunidade se reúne no **WhatsApp**; esses serviços têm suas próprias políticas.",
        ],
      },
      {
        titulo: "Conservação dos dados",
        bloques: [
          "Guardamos os dados de uma inscrição por até três anos depois da atividade, para medir o resultado dos programas e considerar você nas próximas. Depois disso, apagamos ou anonimizamos. Os e-mails de pessoas indicadas que não se inscrevem são apagados após 60 dias.",
        ],
      },
      {
        titulo: "Direitos do titular",
        bloques: [
          "Como titular dos dados, você tem direito a:",
          [
            "Saber que dados seus temos, atualizá-los e corrigi-los.",
            "Pedir prova da autorização que nos deu.",
            "Saber para que os usamos.",
            "Revogar a autorização e pedir que os apaguemos, salvo quando tivermos o dever legal de guardá-los.",
            "Consultá-los gratuitamente.",
            "Apresentar uma queixa à Superintendência de Indústria e Comércio da Colômbia, depois de fazer sua consulta ou reclamação a nós, ou à ANPD, se você estiver no Brasil.",
          ],
        ],
      },
      {
        titulo: "Procedimento para consultas e reclamações",
        bloques: [
          "Escreva para **equipo@aisafetycolombia.org** do e-mail com que nos passou seus dados, com seu nome, o que você pede e, se for uma reclamação, os fatos e qualquer documento que a sustente.",
          [
            "**Consultas** (que dados temos e como os usamos): respondemos em no máximo 10 dias úteis. Se não der, avisamos antes e respondemos em no máximo mais 5 dias úteis.",
            "**Reclamações** (correção, atualização, exclusão ou revogação): respondemos em no máximo 15 dias úteis. Se não der, avisamos antes e respondemos em no máximo mais 8 dias úteis. Se faltar informação na reclamação, pedimos nos 5 dias seguintes; se não a recebermos em dois meses, entendemos que você desistiu.",
          ],
        ],
      },
      {
        titulo: "Cookies e análise de visitas",
        bloques: [
          "O site não usa cookies. Medimos as visitas com o Vercel Web Analytics, que conta páginas vistas sem cookies e sem identificar ninguém. Os formulários guardam um rascunho no seu próprio navegador para você não perder o que já escreveu; ele é apagado ao enviar e nunca chega até nós. As imagens de alguns eventos carregam dos servidores do Luma.",
        ],
      },
      {
        titulo: "Segurança da informação",
        bloques: [
          "As inscrições ficam em um banco de dados fechado ao público, ao qual só se acessa com uma chave do servidor. Só quem organiza cada atividade tem acesso, e só ao que precisa.",
        ],
      },
      {
        titulo: "Vigência e alterações",
        bloques: [
          "Esta política vale desde 9 de outubro de 2026 e os bancos de dados ficam vigentes enquanto a AI Safety Colombia funcionar. Se a mudarmos em algo importante, como uma nova finalidade ou um novo destinatário, publicamos aqui e avisamos por e-mail quem nos passou seus dados.",
        ],
      },
    ],
    casilla:
      "De forma prévia, expressa e informada, e conforme os artigos 9 e 12 da Lei 1581 de 2012 da Colômbia, autorizo a AI Safety Colombia a tratar meus dados para avaliar minha inscrição, organizar a atividade e me escrever sobre ela e sobre suas outras atividades. Conheço meus direitos como titular (artigo 8 dessa lei), explicados na ",
    casillaEnlace: "política de tratamento de dados",
    casillaFalta: "Para enviar sua inscrição você precisa autorizar o tratamento dos seus dados.",
    enlacePie: "Política de dados pessoais",
    faltaCasilla: "A autorização dos seus dados",
  },
};
