import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        home: "Home",
        catalog: "Catalog",
        myBookings: "My Bookings",
        cart: "Cart",
        login: "Login",
        logout: "Logout",
        admin: "Admin Panel",
        searchPlaceholder: "Search Utensils...",
        heroBadge: "Premium Rental Service in Chainpur",
        heroTitle: "Premium Utensils for Weddings",
        heroSub: "Most trusted rental service in Chainpur Hata. Clean utensils, timely delivery.",
        exploreBtn: "View All Items",
        callNow: "Call Us",
        whatsapp: "WhatsApp Us",
        feature1Title: "Spick & Span Clean",
        feature1Sub: "Utensils are deep cleaned after every single event.",
        feature2Title: "Home Delivery",
        feature2Sub: "We deliver directly to your village or home.",
        feature3Title: "Dwar-Tak Delivery",
        feature3Sub: "Hassle-free delivery and pickup right at your event location.",
        quickCategories: "Top Categories",
        contactUs: "Contact Us",
        addressLabel: "Shop Address",
        mobileLabel: "Mobile Number",
        footerText: "Dinesh Bartan Bhandar - Trusted service for years."
    },
    hi: {
        home: "होम",
        catalog: "कैटलॉग",
        myBookings: "मेरी बुकिंग",
        cart: "कार्ट",
        login: "लॉगिन",
        logout: "लॉगआउट",
        admin: "एडमिन पैनल",
        searchPlaceholder: "बर्तन खोजें...",
        heroBadge: "चैनपुर हाटा की प्रीमियम सर्विस",
        heroTitle: "शादी और शुभ कार्यों के लिए प्रीमियम बर्तन",
        heroSub: "चैनपुर हाटा की सबसे पुरानी और भरोसेमंद बर्तन रेंटल सर्विस। साफ़-सुथरे बर्तन, समय पर डिलीवरी।",
        exploreBtn: "बर्तन का सामान देखें",
        callNow: "हमें कॉल करें",
        whatsapp: "व्हाट्सैप्प करें",
        feature1Title: "एकदम साफ़ बर्तन",
        feature1Sub: "हर इवेंट के बाद बर्तनों को मशीन से साफ़ किया जाता है।",
        feature2Title: "होम डिलीवरी",
        feature2Sub: "आपके गाँव या घर तक सामान पहुँचाने की सुविधा।",
        feature3Title: "द्वार-तक डिलीवरी",
        feature3Sub: "आपके घर तक बिना किसी झंझट के सामान पहुँचाया और वापस लिया जाता है।",
        quickCategories: "खास कैटेगरीज",
        contactUs: "संपर्क करें",
        addressLabel: "दुकान का पता",
        mobileLabel: "मोबाइल नंबर",
        footerText: "दिनेश बर्तन भंडार - चैनपुर हाटा | सालों का भरोसा, शुद्धता और सेवा।"
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'hi');

    const toggleLang = () => {
        const newLang = lang === 'en' ? 'hi' : 'en';
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
