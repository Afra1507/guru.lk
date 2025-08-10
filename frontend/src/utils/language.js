// Language utility functions
export const getLanguageName = (code) => {
  switch (code) {
    case "sinhala":
      return "සිංහල";
    case "tamil":
      return "தமிழ்";
    case "english":
      return "English";
    default:
      return "සිංහල"; // Default to Sinhala
  }
};

export const getLanguageCode = (name) => {
  switch (name) {
    case "සිංහල":
      return "sinhala";
    case "தமிழ்":
      return "tamil";
    case "English":
      return "english";
    default:
      return "sinhala"; // Default to Sinhala
  }
};

// Initialize language settings
export const initLanguage = () => {
  const savedLanguage = localStorage.getItem("language") || "sinhala";
  document.documentElement.lang = savedLanguage;
  return savedLanguage;
};

export const setLanguage = (languageCode) => {
  localStorage.setItem("language", languageCode);
  document.documentElement.lang = languageCode;
  window.location.reload(); // Refresh to apply language changes
};

const translations = {
  welcome: {
    sinhala: "සාදරයෙන් පිළිගනිමු",
    tamil: "வரவேற்பு",
    english: "Welcome",
  },
  home: {
    sinhala: "මුල් පිටුව",
    tamil: "முகப்பு",
    english: "Home",
  },
  lessons: {
    sinhala: "පාඩම්",
    tamil: "பாடங்கள்",
    english: "Lessons",
  },
  forum: {
    sinhala: "සංවාද මණ්ඩලය",
    tamil: "அரங்கம்",
    english: "Q&A Forum",
  },
  login: {
    sinhala: "ඇතුල්වන්න",
    tamil: "உள்நுழைய",
    english: "Login",
  },
  register: {
    sinhala: "ලියාපදිංචි වන්න",
    tamil: "பதிவு செய்யவும்",
    english: "Register",
  },
  account: {
    sinhala: "ගිණුම",
    tamil: "கணக்கு",
    english: "Account",
  },
  dashboardLabels: {
    adminDashboard: {
      sinhala: "පරිපාලක පුවරුව",
      tamil: "நிர்வாகக் கட்டுப்பாட்டு பலகை",
      english: "Admin Dashboard",
    },
    contributorDashboard: {
      sinhala: "දායක පුවරුව",
      tamil: "பங்களிப்பாளர் கட்டுப்பாட்டு பலகை",
      english: "Contributor Dashboard",
    },
    myDashboard: {
      sinhala: "මගේ පුවරුව",
      tamil: "எனது கட்டுப்பாட்டு பலகை",
      english: "My Dashboard",
    },
  },
  notifications: {
    sinhala: "සංදේශ",
    tamil: "அறிவிப்புகள்",
    english: "Notifications",
  },
  noNotifications: {
    sinhala: "සංදේශ නොමැත",
    tamil: "அறிவிப்புகள் இல்லை",
    english: "No notifications",
  },
  logout: {
    sinhala: "ඉවත්වන්න",
    tamil: "வெளியேறு",
    english: "Logout",
  },
  // Sidebar related translations
  myProfile: {
    sinhala: "මගේ පැතිකඩ",
    tamil: "என் சுயவிவரம்",
    english: "My Profile",
  },
  browseLessons: {
    sinhala: "පාඩම් සෙවීම",
    tamil: "பாடங்களை பார்",
    english: "Browse Lessons",
  },
  dashboard: {
    sinhala: "ඩැෂ්බෝඩ්",
    tamil: "டாஷ்போர்டு",
    english: "Dashboard",
  },
  startUploading: {
    sinhala: "ආරම්භ කරන්න උඩුගත කිරීම",
    tamil: "பதிவேற்றத்தை துவக்கவும்",
    english: "Start Uploading",
  },
  myUploads: {
    sinhala: "මගේ උඩුගත කිරීම්",
    tamil: "என் பதிவேற்றங்கள்",
    english: "My Uploads",
  },
  uploadStats: {
    sinhala: "උඩුගත කිරීමේ සංඛ්‍යාලේඛන",
    tamil: "பதிவேற்ற புள்ளிவிவரங்கள்",
    english: "Upload Statistics",
  },
  pendingApprovals: {
    sinhala: "අනුමැතිය බලාපොරොත්තු වන්නේ",
    tamil: "காத்திருக்கும் அங்கீகாரங்கள்",
    english: "Pending Approvals",
  },
  allLessons: {
    sinhala: "සියලු පාඩම්",
    tamil: "அனைத்து பாடங்கள்",
    english: "All Lessons",
  },
  contentAnalytics: {
    sinhala: "අන්තර්ගත විශ්ලේෂණය",
    tamil: "உள்ளடக்க பகுப்பாய்வு",
    english: "Content Analytics",
  },
  contentManagement: {
    sinhala: "අන්තර්ගත කළමනාකරණය",
    tamil: "உள்ளடக்க மேலாண்மை",
    english: "Content Management",
  },

  // Dialogs and buttons
  pendingLessonApprovals: {
    sinhala: "බලාපොරොත්තු වන පාඩම් අනුමත කිරීම්",
    tamil: "காத்திருக்கும் பாடங்கள் அங்கீகாரம்",
    english: "Pending Lesson Approvals",
  },
  noPendingLessons: {
    sinhala: "අනුමත කිරීමට බලාපොරොත්තු වන පාඩම් නැත.",
    tamil: "அங்கீகரிக்க காத்திருக்கும் பாடங்கள் இல்லை.",
    english: "No pending lessons to approve.",
  },
  approve: {
    sinhala: "අනුමත කරන්න",
    tamil: "அங்கீகரிக்கவும்",
    english: "Approve",
  },
  close: {
    sinhala: "වසන්න",
    tamil: "மூடு",
    english: "Close",
  },
  confirmApproval: {
    sinhala: "අනුමැතිය තහවුරු කරන්න",
    tamil: "அங்கீகாரத்தை உறுதிப்படுத்தவும்",
    english: "Confirm Approval",
  },
  cancel: {
    sinhala: "අවලංගු කරන්න",
    tamil: "ரத்து செய்",
    english: "Cancel",
  },
  yes: {
    sinhala: "ඔව්",
    tamil: "ஆம்",
    english: "Yes",
  },
  confirmApprovalMessage: {
    sinhala: 'ඔබ "$title" පාඩම අනුමත කිරීමට තහවුරු කර සිටීද?',
    tamil: '"$title" பாடத்தை நீங்கள் அங்கீகரிக்கிறீர்களா?',
    english: 'Are you sure you want to approve the lesson: "$title"?',
  },

  // Snackbar messages
  lessonApprovedSuccess: {
    sinhala: "පාඩම සාර්ථකව අනුමත කරන ලදි!",
    tamil: "பாடம் வெற்றிகரமாக அங்கீகரிக்கப்பட்டது!",
    english: "Lesson approved successfully!",
  },
  lessonApprovedFail: {
    sinhala: "පාඩම අනුමත කිරීමට අසමත් විය.",
    tamil: "பாடம் அங்கீகரிக்க முடியவில்லை.",
    english: "Failed to approve lesson.",
  },
  approvalCancelled: {
    sinhala: "අනුමැතිය අවලංගු කරන ලදි.",
    tamil: "அங்கீகாரம் ரத்து செய்யப்பட்டது.",
    english: "Approval cancelled.",
  },
    footer: {
    aboutTitle: {
      sinhala: "GURU.Ik පිළිබඳව",
      tamil: "GURU.Ik பற்றி",
      english: "About GURU.Ik",
    },
    aboutDescription: {
      sinhala:
        "ශ්‍රී ලංකාවේ සමගාමී අධ්‍යාපනය සඳහා ජනයා අතර දැනුම බෙදාගන්නා ප්ලැට්ෆෝමයකි. රටපුරා ශිෂ්‍යයින් සහ ගුරුවරුන් අතර පාලමක් සෑදීම.",
      tamil:
        "இலங்கையில் உள்ள ஒருங்கிணைந்த கல்விக்கான சமூக அறிவு பகிர்வுப் பிளாட்ஃபாம். நாட்டில் உள்ள கற்றுக்கொள்ளும் மற்றும் கற்பிக்கும் இடையே பாலம் அமைத்தல்.",
      english:
        "A community knowledge sharing platform for inclusive education in Sri Lanka. Bridging the gap between learners and educators across the country.",
    },
    quickLinksTitle: {
      sinhala: "ඉක්මන් සබැඳි",
      tamil: "விரைவு இணைப்புகள்",
      english: "Quick Links",
    },
    contactUsTitle: {
      sinhala: "අප හා සම්බන්ධ වන්න",
      tamil: "எங்களை தொடர்பு கொள்ள",
      english: "Contact Us",
    },
    universityName: {
      sinhala: "ශ්‍රී ජයවර්ධනපුර විශ්ව විද්‍යාලය",
      tamil: "ஸ்ரீ ஜெயவர்தனபுர பல்கலைக்கழகம்",
      english: "University of Sri Jayewardenepura",
    },
    faculty: {
      sinhala: "යෙදුම් විද්‍යා පීඨය",
      tamil: "விண்ணப்ப அறிவியல் பீடம்",
      english: "Faculty of Applied Sciences",
    },
    department: {
      sinhala: "කම්පියුටර් විද්‍යා දෙපාර්තමේන්තුව",
      tamil: "கணினி அறிவியல் துறை",
      english: "Department of Computer Science",
    },
    phoneLabel: {
      sinhala: "දුරකථන අංකය",
      tamil: "தொலைபேசி எண்",
      english: "Phone",
    },
    emailLabel: {
      sinhala: "ඊ-තැපැල්",
      tamil: "மின்னஞ்சல்",
      english: "Email",
    },
    copyrightText: {
      sinhala: "සියලු හිමිකම් ඇවිරිණි",
      tamil: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
      english: "All Rights Reserved",
    },
    developedBy: {
      sinhala: "සංවර්ධනය කළේ AS2022468, AS2022471 විසින්",
      tamil: "AS2022468, AS2022471 இன் மூலம் உருவாக்கப்பட்டது",
      english: "Developed by AS2022468, AS2022471",
    },
  },
  loginPage: {
  welcomeBack: {
    sinhala: "ආයුබෝවන්",
    tamil: "வரவேற்பு",
    english: "Welcome Back",
  },
  pleaseLogin: {
    sinhala: "ඉදිරියට යාමට කරුණාකර පිවිසෙන්න",
    tamil: "தொடர செல்ல உள்நுழையவும்",
    english: "Please login to continue",
  },
  username: {
    sinhala: "පරිශීලක නාමය",
    tamil: "பயனர் பெயர்",
    english: "Username",
  },
  password: {
    sinhala: "මුරපදය",
    tamil: "கடவுச்சொல்",
    english: "Password",
  },
  loginButton: {
    sinhala: "ඇතුල්වන්න",
    tamil: "உள்நுழைய",
    english: "Login",
  },
  dontHaveAccount: {
    sinhala: "ඇකවුන්තුවක් නැද්ද?",
    tamil: "கணக்கு இல்லையா?",
    english: "Don't have an account?",
  },
  registerHere: {
    sinhala: "ලියාපදිංචි වන්න",
    tamil: "பதிவு செய்யவும்",
    english: "Register",
  },
  togglePasswordVisibility: {
    sinhala: "මුරපද දෘශ්‍යතාවය මාරු කරන්න",
    tamil: "கடவுச்சொல் காட்சியை மாற்றவும்",
    english: "Toggle password visibility",
  }
},
  contentCard: {
    downloadProcessing: {
      sinhala: "සංස්කරණය වෙමින් පවතී...",
      tamil: "செயலாக்கப்படுகிறது...",
      english: "Processing...",
    },
    download: {
      sinhala: "බාගැනීම",
      tamil: "பதிவிறக்கம்",
      english: "Download",
    },
    pleaseLoginToDownload: {
      sinhala: "බාගැනීමට කරුණාකර පිවිසෙන්න.",
      tamil: "பதிவிறக்க துட்பாருங்கள்.",
      english: "Please login to download.",
    },
    downloadRegistered: {
      sinhala: "බාගැනීම සාර්ථකයි! බාගැනීම ආරම්භ වෙමින් පවතී...",
      tamil: "பதிவிறக்கம் பதிவு செய்யப்பட்டது! பதிவிறக்கம் துவங்குகிறது...",
      english: "Download registered! Starting download...",
    },
    downloadUrlNotFound: {
      sinhala: "බාගැනීමේ URL නොමැත.",
      tamil: "பதிவிறக்க URL கிடைக்கவில்லை.",
      english: "Download URL not found in the response.",
    },
    userIdNotFound: {
      sinhala: "පරිශීලක හැඳුනුම හඳුනාගත නොහැක. කරුණාකර නැවත පිවිසෙන්න.",
      tamil: "பயனர் ஐடி காணப்படவில்லை. மீண்டும் உள்நுழையவும்.",
      english: "Could not determine user ID. Please login again.",
    },
    downloadFailed: {
      sinhala: "බාගැනීම අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.",
      tamil: "பதிவிறக்கம் தோல்வி. மீண்டும் முயற்சிக்கவும்.",
      english: "Download failed. Please try again.",
    },
  },
};

export const translate = (key, language) => {
  // Support nested keys using dot notation
  const keys = key.split(".");
  let result = translations;

  for (const k of keys) {
    if (result[k]) {
      result = result[k];
    } else {
      return key; // fallback to key if path invalid
    }
  }
  return result[language] || key;
};
