// Reveal page sections as they enter the viewport.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".section-head, .category, .story-copy, .story-image, .contact-inner")
    .forEach(element => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}

// Toggle the compact navigation on phones and tablets.
const siteNav = document.querySelector(".nav");
const menuButton = document.querySelector(".menu");

if (siteNav && menuButton) {
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  siteNav.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (!siteNav.contains(event.target)) closeMenu();
  });
}

// Switch the History photo and matching description with the selected era.
const eraTabs = [...document.querySelectorAll(".era-tab")];
const eraImage = document.querySelector("#era-image");

if (eraTabs.length && eraImage) {
  function activateEra(index) {
    const activeTab = eraTabs[index];
    if (!activeTab) return;

    eraTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      const panel = document.getElementById(`era-panel-${tabIndex}`);
      if (panel) panel.hidden = !isActive;
    });

    const imagePath = activeTab.dataset.image;
    const eraName = activeTab.querySelector("strong")?.textContent.trim();

    if (imagePath) eraImage.src = imagePath;
    if (eraName) eraImage.alt = `키친프라이드 연혁 사진: ${eraName}`;
  }

  eraTabs.forEach((tab, index) => {
    tab.addEventListener("mouseenter", () => activateEra(index));
    tab.addEventListener("focus", () => activateEra(index));
    tab.addEventListener("click", () => activateEra(index));

    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? eraTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + eraTabs.length)
            % eraTabs.length;

      eraTabs[nextIndex].focus();
    });
  });

  // Preload the four photos for smoother hover switching.
  eraTabs.forEach(tab => {
    if (!tab.dataset.image) return;
    const image = new Image();
    image.src = tab.dataset.image;
  });

  const initiallySelected = eraTabs.findIndex(
    tab => tab.getAttribute("aria-selected") === "true"
  );
  activateEra(initiallySelected >= 0 ? initiallySelected : 0);
}
// Render the requested refrigerator model from its model-specific URL.
const detailRoot = document.querySelector("[data-refrigerator-detail]");

if (detailRoot) {
  const refrigeratorModels = {
    "UDS-25RIE-2D": {
      series: "25BOX 양문형",
      model: "UDS-25RIE-2D",
      description: "25BOX 냉장 전용 구성입니다.",
      image: "assets/everzen-25box.jpg",
      specs: [
        ["냉장 용량", "510 L"], ["냉동 용량", "없음"],
        ["외형 크기", "655 × 800 × 1,900 mm"], ["중량", "108 kg"],
        ["정격전력", "770 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃"]
      ]
    },
    "UDS-25FIE-2D": {
      series: "25BOX 양문형",
      model: "UDS-25FIE-2D",
      description: "25BOX 냉동 전용 구성입니다.",
      image: "assets/everzen-25box.jpg",
      detailImage: "assets/25box_detail.jpg",
      specs: [
        ["냉장 용량", "없음"], ["냉동 용량", "510 L"],
        ["외형 크기", "655 × 800 × 1,900 mm"], ["중량", "108 kg"],
        ["정격전력", "770 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"]
      ]
    },
    "UDS-45RFIE": {
      series: "45BOX 냉장·냉동 조합",
      model: "UDS-45RFIE",
      description: "45BOX 냉장 800 L와 냉동 240 L 조합 모델입니다.",
      image: "assets/everzen-45box.jpg",
      detailImage: "assets/45box_detail-updated.jpg",
      specs: [
        ["냉장 용량", "800 L"], ["냉동 용량", "240 L"],
        ["외형 크기", "1,240 × 830 × 1,960 mm"], ["중량", "149 kg"],
        ["정격전력", "700 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃ · 냉동 -20℃ ~ -15℃"]
      ]
    },
    "UDS-45VRFIE": {
      series: "45BOX 냉장·냉동 조합",
      model: "UDS-45VRFIE",
      description: "45BOX 냉장 525 L와 냉동 514 L 조합 모델입니다.",
      image: "assets/everzen-45box.jpg",
      specs: [
        ["냉장 용량", "525 L"], ["냉동 용량", "514 L"],
        ["외형 크기", "1,240 × 830 × 1,960 mm"], ["중량", "149 kg"],
        ["정격전력", "750 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃ · 냉동 -20℃ ~ -15℃"]
      ]
    },
    "UDS-45RIE": {
      series: "45BOX 냉장 전용",
      model: "UDS-45RIE",
      description: "45BOX 냉장 전용 모델입니다.",
      image: "assets/everzen-45box.jpg",
      specs: [
        ["냉장 용량", "1,119 L"], ["냉동 용량", "없음"],
        ["외형 크기", "1,240 × 830 × 1,960 mm"], ["중량", "149 kg"],
        ["정격전력", "350 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃"]
      ]
    },
    "UDS-45FIE": {
      series: "45BOX 냉동 전용",
      model: "UDS-45FIE",
      description: "45BOX 냉동 전용 모델입니다.",
      image: "assets/everzen-45box.jpg",
      specs: [
        ["냉장 용량", "없음"], ["냉동 용량", "1,106 L"],
        ["외형 크기", "1,240 × 830 × 1,960 mm"], ["중량", "149 kg"],
        ["정격전력", "700 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉동 -20℃ ~ -15℃"]
      ]
    },
    "UDS-65RIE-2D": {
      series: "65BOX 양문형",
      model: "UDS-65RIE-2D",
      description: "65BOX 냉장 전용 구성입니다. 카탈로그의 글라스 도어 옵션 정보도 함께 확인할 수 있습니다.",
      image: "assets/everzen-65box.jpg",
      detailImage: "assets/65glass_detail.jpg",
      glassImage: "assets/65glass_detail.jpg",
      specs: [
        ["냉장 용량", "1,717 L"], ["냉동 용량", "없음"],
        ["외형 크기", "1,900 × 800 × 1,900 mm"], ["중량", "199 kg"],
        ["정격전력", "730 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃"]
      ]
    },
    "UDS-65RFIE": {
      series: "65BOX 냉장·냉동 조합",
      model: "UDS-65RFIE",
      description: "65BOX 냉장 1,148 L와 냉동 518 L 구성의 상세 카탈로그입니다.",
      image: "assets/everzen-65box.jpg",
      detailImage: "assets/65box_detail.jpg",
      specs: [
        ["냉장 용량", "1,148 L"], ["냉동 용량", "518 L"],
        ["외형 크기", "1,900 × 800 × 1,900 mm"], ["중량", "199 kg"],
        ["정격전력", "750 W"], ["전원", "AC 220 V / 55/60 Hz 겸용"],
        ["온도 범위", "냉장 0℃ ~ +5℃ · 냉동 -20℃ ~ -15℃"]
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const model = refrigeratorModels[params.get("model")];
  const productView = document.querySelector("#product-view");
  const modelNotFound = document.querySelector("#model-not-found");

  if (!model) {
    if (productView) productView.hidden = true;
    if (modelNotFound) modelNotFound.hidden = false;
  } else {
    const glassVariant = params.get("variant") === "glass" && model.glassImage;
    document.querySelector("#detail-series").textContent = model.series;
    document.querySelector("#detail-name").textContent = model.series;
    document.querySelector("#detail-model").textContent = model.model;
    document.querySelector("#detail-description").textContent = model.description;

    const image = document.querySelector("#detail-image");
    image.src = glassVariant ? model.glassImage : model.image;
    image.alt = `${model.series} ${glassVariant ? "글라스 도어 옵션" : "제품 사진"}`;

    document.querySelector("#detail-specs").innerHTML = model.specs
      .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
      .join("");

    const doorOption = document.querySelector("#door-options");
    if (doorOption) doorOption.hidden = !model.glassImage;

    const detailSheet = document.querySelector("#detail-sheet");
    if (model.detailImage && detailSheet) {
      detailSheet.hidden = false;
      document.querySelector(".refrigerator-detail-grid").hidden = true;
      document.querySelector("#detail-sheet-title").textContent = model.series;
      document.querySelector("#detail-sheet-model").textContent = model.model;
      const sheetImage = document.querySelector("#detail-sheet-image");
      sheetImage.src = model.detailImage;
      sheetImage.alt = `${model.model} 제품 상세 카탈로그 이미지`;
      if (doorOption) doorOption.hidden = true;

      const bottomProductPhoto = document.querySelector("#detail-product-photo");
      if (model.model === "UDS-65RIE-2D" && bottomProductPhoto) {
        bottomProductPhoto.hidden = false;
        const bottomImage = document.querySelector("#detail-product-photo-image");
        bottomImage.src = "assets/everzen-65box-glass.jpg";
        bottomImage.alt = "에버젠 65BOX 글라스 도어 모델 사진";
      }
    }

    document.title = `${model.model} | 에버젠 업소용 냉장고 | 키친프라이드`;
    if (glassVariant) {
      window.addEventListener("load", () => {
        document.querySelector("#door-options")?.scrollIntoView({ block: "center" });
      }, { once: true });
    }
  }
}

// Show the two promotional posters when the home page is opened.
const homeAnnouncement = document.querySelector("#home-announcement");

if (homeAnnouncement && typeof homeAnnouncement.showModal === "function") {
  homeAnnouncement.showModal();

  homeAnnouncement.querySelectorAll("[data-announcement-close]").forEach(button => {
    button.addEventListener("click", () => homeAnnouncement.close());
  });

  homeAnnouncement.addEventListener("click", event => {
    if (event.target === homeAnnouncement) homeAnnouncement.close();
  });
}

// Site-wide Korean / English / Vietnamese language switcher.
(() => {
  const translations = {
    en: {
      "매일의 주방을 더 든든하게, 키친프라이드": "A stronger partner for every kitchen, Kitchen Pride",
      "제품 카테고리": "Products", "브랜드 이야기": "Our Story", "문의하기": "Contact",
      "상담 요청": "Request a consultation", "제품 둘러보기": "Explore products", "전문가 상담": "Talk to an expert",
      "좋은 주방의 시작, 키친프라이드": "A better kitchen starts with Kitchen Pride",
      "매일 바쁘게 돌아가는 주방일수록, 믿을 수 있는 장비가 필요하니까. 오래 쓰고 싶은 업소용 주방의 기준을 만듭니다.": "Busy kitchens need equipment they can rely on. We set the standard for commercial kitchens built to last.",
      "가게의 규모와 동선에 꼭 맞는 주방 설비를 함께 고민합니다.": "We help find kitchen equipment that fits your space and workflow.",
      "주방의 든든한 파트너": "Your trusted kitchen partner", "고민부터 설치까지, 한 번에": "From planning to installation",
      "업소 맞춤 제품 제안": "Solutions tailored to your business", "믿을 수 있는 품질": "Reliable quality", "빠르고 친절한 상담": "Fast, friendly support",
      "주방에 필요한 모든 것,": "Everything your kitchen needs,", "한곳에서 만나보세요.": "all in one place.",
      "작은 조리 도구부터 핵심 설비까지 주방의 흐름을 생각해 준비했습니다.": "From everyday tools to essential equipment, selected for the way kitchens work.",
      "업소용 냉장고": "Commercial Refrigerators", "신선함을 오래 지키는 냉장 솔루션": "Cooling solutions that keep ingredients fresh",
      "업소용 튀김기": "Commercial Fryers", "다양한 주방 환경에 맞춘 튀김기 시리즈": "Fryer options for different kitchen needs",
      "주방용품": "Kitchenware", "손이 자주 가는 도구부터 꼼꼼하게": "Thoughtful essentials for everyday work",
      "주방의 오늘을 알고,": "We understand today's kitchens,", "내일을 준비합니다.": "and prepare for tomorrow.",
      "좋은 장비는 주방의 리듬을 바꿉니다. 키친프라이드는 현장의 목소리를 먼저 듣고, 공간과 메뉴에 꼭 맞는 제품을 제안합니다. 처음 시작하는 주방에도, 더 나은 내일을 준비하는 주방에도 든든한 파트너가 되겠습니다.": "The right equipment transforms a kitchen's rhythm. We listen first and recommend products suited to your space and menu. We are here for kitchens just starting out and those preparing for what comes next.",
      "현장을 이해하는 제안": "Advice grounded in experience", "업종과 공간에 맞춘 실용적인 구성": "Practical setups for your business and space",
      "검증된 제품의 기준": "Products you can trust", "매일 쓰는 장비일수록 꼼꼼하게": "Carefully selected for everyday use",
      "편안한 상담 경험": "Friendly guidance", "처음 문의부터 설치까지 친절하게": "Helpful service from first inquiry to installation",
      "오래 가는 파트너십": "A lasting partnership", "구매 후에도 이어지는 지원": "Support that continues after purchase",
      "우리 가게에 맞는 장비,": "Equipment for your business,", "함께 찾아볼까요?": "let's find it together.",
      "원하는 제품이나 주방 고민을 들려주세요. 친절하게 안내해 드립니다.": "Tell us what you need or what your kitchen is facing. We are happy to help.",
      "전화하기": "Call us", "Google 지도에서 보기 ↗": "View on Google Maps ↗", "키친프라이드 소식과 제품 카탈로그": "Kitchen Pride news and product catalog",
      "이미지를 누르면 큰 화면으로 볼 수 있습니다.": "Select an image to view it full size.", "닫기": "Close",
      "시기를 선택해 주요 발자취를 살펴보세요.": "Choose an era to explore our milestones.", "키보드 방향키로도 이동할 수 있습니다.": "You can also navigate with the arrow keys.",
      "좋은 주방을 향한": "A journey toward better kitchens", "키친프라이드의 발자취": "The Kitchen Pride story",
      "작은 시작에서 쌓아온 기술과 현장의 경험. 시대의 변화에 맞춰 더 나은 주방을 고민해 온 키친프라이드의 이야기를 소개합니다.": "Built on hands-on experience and steady progress, our story reflects a lasting commitment to better kitchens through changing times.",
      "시대마다 이어온": "A legacy of", "도전과 성장": "progress and growth", "기반형성기": "Foundation", "고도성장기": "Rapid Growth", "전환기": "Transition", "재도약기": "Renewal",
      "1962년 설립 이후 스테인리스 냉연 강판과 양식기 생산을 시작했습니다. 위생적인 주방 환경을 위한 소재와 제조 기술의 기반을 다지며 국내 주방용품 산업의 성장에 함께했습니다.": "Founded in 1962, the company began producing stainless cold-rolled sheets and tableware. We built a foundation in materials and manufacturing for hygienic kitchens and grew alongside Korea's kitchenware industry.",
      "수출 협력과 제품 개발을 확대하며 성장의 속도를 높였습니다. 디자인과 품질을 꾸준히 개선하고 국내 주요 백화점에 제품을 공급하며 시장을 넓혀갔습니다.": "We expanded export partnerships and product development, continually improving design and quality while supplying leading department stores in Korea.",
      "1990년대 시장 변화 속에서 새로운 생산 기반을 마련했습니다. 1993년 중국 천진에 공장을 세우고 유럽 수출과 중국 내 유통을 이어가며 다음 성장을 준비했습니다.": "As markets changed in the 1990s, we established a new production base. In 1993, we opened a factory in Tianjin, China, and continued exports to Europe and distribution in China.",
      "해외 무역과 공급망을 넓히며 다양한 외식 브랜드와 거래처에 제품을 공급하고 있습니다. 꾸준한 품질 개선과 신상품 개발로 새로운 도전을 이어갑니다.": "We expanded international trade and supply networks, serving food-service brands and business customers. We continue to improve quality and develop new products.",
      "하노이 직영점 오픈 안내": "Hanoi flagship store opening", "업소용 냉장고 상세 카탈로그 이미지": "Commercial refrigerator product catalog",
      "주방용품 카탈로그": "Kitchenware catalog", "전체 카탈로그 보기": "View the full catalog", "제품 사양": "Specifications", "주요 특징": "Key features",
      "모델명": "Model", "외형 크기": "Dimensions", "중량": "Weight", "정격전력": "Rated power", "전원": "Power supply", "온도 범위": "Temperature range",
      "냉장 용량": "Refrigerator capacity", "냉동 용량": "Freezer capacity", "냉장 전용": "Refrigerator", "냉동 전용": "Freezer", "냉장·냉동 조합": "Refrigerator / freezer combination",
      "제품 상세 보기": "View product details", "자세히 보기": "Learn more", "이전": "Previous", "다음": "Next", "페이지를 찾을 수 없습니다.": "Page not found.",
      "간접냉각방식 업소용 냉장고": "Indirect-cooling commercial refrigerators", "25BOX, 45BOX, 65BOX 모델과 카탈로그 사양을 확인하세요.": "Explore 25BOX, 45BOX, and 65BOX models and catalog specifications.",
      "업소용 튀김기. 하이브리드, 프리미엄, 에코, 스마트, 터보, 자동 시리즈를 만나보세요.": "Explore Hybrid, Premium, Eco, Smart, Turbo, and Automatic commercial fryer series.",
      "주방용품 및 업소용 조리기기 제품군. 도매, 상담, 설계, 주문 제작을 안내합니다.": "Kitchenware and commercial cooking equipment. Wholesale, consultation, design, and custom orders.",
      "모델 상세": "Model details", "모델 상세 보기": "View model details", "전체 모델 보기": "View all models", "이 모델 상담하기": "Ask about this model",
      "모델 정보를 불러오는 중입니다": "Loading model information", "모델 정보를 찾을 수 없습니다.": "Model information not found.", "냉장고 모델 목록에서 제품을 다시 선택해 주세요.": "Please select a product from the refrigerator model list.", "냉장고 모델 목록": "Refrigerator models",
      "글라스 도어 선택": "Glass door option", "표기 사양은 제공된 EVERZEN 카탈로그 기준입니다. 제품 구성과 설치 조건은 상담 시 확인해 주세요.": "Specifications are based on the supplied EVERZEN catalog. Please confirm configuration and installation requirements with us.",
      "주방용품 카탈로그": "Kitchenware catalog", "냉장·저장": "Refrigeration & storage", "조리·구이": "Cooking & grilling", "전처리·가공": "Preparation & processing", "식기·냄비": "Tableware & cookware", "도구·주방 보조": "Tools & kitchen accessories",
      "하이브리드": "Hybrid", "프리미엄": "Premium", "에코": "Eco", "스마트": "Smart", "터보": "Turbo", "자동": "Automatic",
      "문의하기": "Contact", "신상품 다량입하": "New products in stock", "주방용품 한 자리에서 준비 끝": "Everything for your kitchen in one place",
      "필요한 구성으로 선택하는": "Choose the configuration you need", "간접냉각 냉장고": "indirect-cooling refrigerators",
      "에버젠 간접냉각방식 냉장고의 BOX별 구성과 모델 정보를 카탈로그 기준으로 정리했습니다. 냉장·냉동 조합, 도어 형태와 설치 치수를 비교해 보세요.": "Explore EVERZEN indirect-cooling models and configurations based on the catalog. Compare cooling combinations, door styles, and installation dimensions.",
      "모델 살펴보기": "Explore models", "제품 상담": "Product consultation", "간접냉각방식": "Indirect cooling", "냉장·냉동 조합": "Refrigerator / freezer combination", "양문형 옵션": "Double-door options",
      "모델별 사양": "Specifications by model", "사양은 제공해 주신 EVERZEN 카탈로그를 기준으로 옮겼습니다.": "Specifications are based on the EVERZEN catalog you provided.", "모델별 구성을 확인한 뒤 상담을 요청해 주세요.": "Review each configuration and contact us for a consultation.",
      "양문형": "Double door", "대용량": "Large capacity", "도어 옵션": "Door options", "냉장 전용 또는 냉동 전용 모델로 구성됩니다.": "Available in refrigerator-only or freezer-only configurations.", "냉장·냉동 용량 조합에 따라 네 가지 모델을 선택할 수 있습니다.": "Choose from four models with different refrigerator and freezer capacities.",
      "넉넉한 수납 구성이 가능합니다.": "Designed for generous storage capacity.", "냉장 온도 범위": "Refrigeration temperature range", "필요한 모델을 찾지 못하셨나요?": "Didn't find the model you need?", "설치 공간과 필요한 용량을 알려주시면 안내해 드립니다.": "Tell us your available space and capacity needs, and we will help.",
      "키친프라이드는 현장의 목소리를 먼저 듣고, 공간과 메뉴에 꼭 맞는 제품을 제안합니다.": "We listen to your needs and recommend equipment suited to your space and menu.",
      "새로 추가된 제품을": "See the latest products", "사진으로 만나보세요.": "in our photo gallery.", "업소용 세척·소독·보온 설비와 그릴 제품 사진을 추가했습니다.": "New photos of commercial washing, sanitizing, warming, and grilling equipment.",
      "업소용 식기세척기": "Commercial dishwasher", "식기세척기 제품 이미지": "Dishwasher product image", "식기세척기": "Dishwasher", "식기세척기 구성": "Dishwasher configurations", "업소용 보온고": "Commercial warmer", "DS-120 보온고": "DS-120 warmer", "스테인리스 주방 장비": "Stainless-steel kitchen equipment", "업소용 그릴": "Commercial grill",
      "주방에 필요한 제품을": "Find the right products", "용도에 맞게 살펴보세요.": "for your kitchen.", "아래 제품군은 제공된 키친프라이드 카탈로그 이미지에 기재된 항목을 기준으로 정리했습니다.": "The categories below are based on items shown in the Kitchen Pride catalog you provided.", "세부 모델과 재고, 사양은 문의해 주세요.": "Contact us for model details, availability, and specifications.",
      "냉장·저장 설비": "Refrigeration & storage equipment", "조리·구이 기기": "Cooking & grilling equipment", "전처리·가공 기기": "Preparation & processing equipment", "식기·냄비·팬": "Tableware, cookware & pans", "도구·주방 보조": "Tools & kitchen accessories",
      "원하는 품목과 사용 환경을 알려주시면 상담을 통해 제품과 구성을 안내해 드립니다.": "Tell us what you need and how your kitchen operates. We can recommend products and configurations.", "제품 상담하기": "Ask about products", "필요한 주방용품과 구성,": "Kitchenware and configurations,", "함께 찾아보겠습니다.": "let's find the right fit.", "제품명이나 필요한 용도를 알려주시면 상담해 드립니다.": "Tell us the product name or how you plan to use it, and we will help.",
      "이 모델이 우리 주방에 맞을지 함께 확인해 보세요.": "Let's see if this model fits your kitchen.", "모델명과 설치 공간을 알려주시면 안내해 드립니다.": "Share the model name and available installation space, and we will advise you.", "대표 나이권": "Director Na I-kwon", "모델 상세": "Model details"
      ,"65BOX 글라스 도어 구성. 냉장·냉동 칸에 따라 선택 가능한 도어 옵션이 다르므로 상담 시 확인해 주세요.": "65BOX glass-door configuration. Available door options vary by refrigerator and freezer compartment; please confirm when you contact us."
      ,"주방의 리듬에 맞춘": "In rhythm with your kitchen", "시리즈 살펴보기": "Explore the series", "주방에 맞는 시리즈를": "Compare series", "비교해 보세요.": "for your kitchen.",
      "키친프라이드의 튀김기 시리즈를 한곳에서 살펴보세요. 제품 사진과 구성은 제공된 이미지 기준으로 소개하며, 상세 사양과 모델은 상담을 통해 확인하실 수 있습니다.": "Explore the Kitchen Pride fryer range. Photos and configurations are based on the supplied images; contact us for model details and specifications.", "시리즈별 제품 이미지를 먼저 확인하고,": "Browse product photos by series,", "필요한 용량과 설치 조건은 상담으로 안내받으세요.": "then contact us about capacity and installation requirements.",
      "여러 형태의 제품 구성을 사진으로 확인해 보세요. 세부 모델과 사양은 문의 시 안내해 드립니다.": "View photos of the available configurations. Contact us for model and specification details.", "현재 보유한 프리미엄 제품 사진을 보여드립니다. 추가 사진과 실제 제품 옵션은 문의해 주세요.": "See our available Premium product photos. Contact us for additional photos and available options.", "에코 튀김기 시리즈의 제품 구성을 사진으로 확인해 보세요. 실제 제품 옵션은 별도 문의 바랍니다.": "View photos of the Eco fryer configurations. Please contact us for available product options.", "스마트 시리즈 제품군을 살펴보세요. 모델별 제어 기능과 상세 구성은 상담해 드립니다.": "Explore the Smart series. Contact us for model-specific controls and configuration details.", "터보 시리즈 제품 이미지를 확인해 보세요. 설치 환경과 사용 목적에 맞는 제품은 상담으로 안내해 드립니다.": "View Turbo series product photos. We can help select a product for your space and needs.", "자동 튀김기 제품 사진입니다. 제품 구성과 사용 환경에 맞는 상세 정보는 문의해 주세요.": "Automatic fryer product photo. Contact us for configuration details suited to your operation.",
      "주방 환경에 맞는 튀김기,": "A fryer for your kitchen,", "관심 있는 시리즈와 필요한 구성을 알려주시면 안내해 드립니다.": "Tell us which series and configuration you are interested in, and we will help.", "주방용품 한자리에서,": "Kitchenware all in one place,", "준비를 더 든든하게.": "for a more prepared kitchen.", "매일 쓰는 조리 도구부터 업소용 주방기기까지. 필요한 제품을 살펴보고, 주방 환경에 맞는 구성과 주문 제작을 상담해 보세요.": "From everyday cooking tools to commercial equipment, explore what you need and ask us about custom configurations for your kitchen.",
      "제품군 둘러보기": "Explore categories", "주방용품·주방기기 도매": "Kitchenware and equipment wholesale", "상담·설계·주문 제작": "Consultation, design, and custom orders", "빠른 배송·A/S 안내": "Fast delivery and after-sales service", "제품 사진 보기 ↗": "View product photos ↗", "블로그 소식 보기 ↗": "Read blog updates ↗",
      "냉장고·냉동고 · 유리문 냉장고 · 작업대 냉장고 · 밧트 냉장고 · 토핑 냉장고 · 김치 냉장고 · 쇼케이스 · 숙성고 · 슬러시 냉장고 · 육수 냉장고 · 제빙기 · 보온고": "Refrigerators · freezers · glass-door refrigerators · refrigerated worktables · ingredient pan refrigerators · topping refrigerators · kimchi refrigerators · display cases · aging refrigerators · slush machines · broth refrigerators · ice makers · warmers",
      "하향식 로스타 · 화로식 로스타 · 가스직화그릴 로스타 · 숯·부탄 로스타 · 무연숯불 로스타 · 닭갈비 로스타 · 사각무연 로스타 · 수냉식 로스타 · 돌판 로스타 · 철판 구이기 · 업소용 인덕션 · 무연전기 로스타 · 전기 로스타 · 코팅 불판 · 계란 불판 · 쭈꾸미 철판 · 스텐 불판 · 실석쇠 · 석쇠 · 구이기 · 초벌 구이기": "Downdraft grills · brazier grills · gas flame grills · charcoal and butane grills · smokeless charcoal grills · dak-galbi grills · square smokeless grills · water-cooled grills · stone plate grills · griddles · commercial induction cooktops · smokeless electric grills · electric grills · coated grill plates · egg grill plates · webfoot octopus plates · stainless grill plates · mesh grills · grates · grills · pre-grills",
      "식기 세척기 · 싱크대·잔반처리대 · 작업대·선반 · 불판 세척기 · 튀김기 · 탁상형 튀김기 · 자동 튀김기 · 부침기 · 육절기 · 슬라이서기 · 골절기 · 민서기 · 연육기 · 칼절기 · 반죽기 · 제면기 · 냉면기 · 양념 분쇄기 · 마늘편기 · 파절기·탕파기 · 스탠믹서기 · 포장기계": "Dishwashers · sinks and food-waste stations · worktables and shelves · grill-plate washers · fryers · countertop fryers · automatic fryers · griddles · meat cutters · slicers · bone saws · meat grinders · tenderizers · knife sharpeners · dough mixers · noodle machines · cold-noodle machines · seasoning grinders · garlic slicers · scallion slicers · stand mixers · packaging machines",
      "멜라민 그릇 · 티타늄 찬기 · 방짜 그릇 · 스테인리스 찬기 · 양은 그릇 · 황전골 황냄비 · 주전자 · 양은 도시락 · 경질 전골냄비 · 삼중 전골팬 · 후라이팬·궁중팬 · 경질 나무자루 웍 · 양은 중국팬 · 중화팬 · 뚝배기 · 무쇠솥 · 돌솥 · 돌 김치전골 · 스테인리스 통 · 믹싱볼·양푼 · 스테인리스 양념통 · 밧드 · 수저·젓가락 · 수저함": "Melamine bowls · titanium side-dish bowls · brassware · stainless side-dish bowls · aluminum bowls · hot-pot cookware · kettles · aluminum lunch boxes · hard-anodized hot pots · tri-ply hot-pot pans · frying pans and woks · hard-anodized wooden-handle woks · aluminum Chinese pans · woks · earthenware pots · cast-iron pots · stone pots · stone kimchi pots · stainless containers · mixing bowls · stainless seasoning containers · food pans · spoons and chopsticks · cutlery boxes",
      "숯대감 발화기 · 숯통·집게 · 후드·코브라 후드 · 칼 · 가위 · 스텐 집게 · 전지가위 · 채칼 · 밀폐통 · 물통 · 소스통 · 목기 조리도구 · 타이머·온도계 · 서빙카트 · 강통 테이블 · 피자화덕 · 전기 물끓이기 · 면 삶는 기계 · 순대 기계 · 부르스타 · 어묵 조리기 · 전기 떡볶기 · 카스 저울 · 압력돌솥기 · 쿠쿠 전기밥솥 · 린나이 가스밥솥 · 풍년 압력밥솥": "Charcoal starters · charcoal bins and tongs · hoods · knives · scissors · stainless tongs · kitchen shears · slicers · airtight containers · water jugs · sauce bottles · wooden cooking utensils · timers and thermometers · serving carts · steel tables · pizza ovens · electric water boilers · noodle cookers · sundae cookers · portable gas stoves · fish-cake cookers · electric tteokbokki cookers · CAS scales · pressure stone-pot cookers · Cuckoo rice cookers · Rinnai gas rice cookers · Pungnyeon pressure cookers",
      "서진산업 설립, 주방용품 생산의 시작": "Seojin Industrial founded; kitchenware production begins", "스테인리스 냉연 강판을 활용한 생산 기반 마련": "Production established using stainless cold-rolled steel", "스테인리스 양식기와 주방기기 수요에 대응": "Responded to demand for stainless tableware and kitchen equipment", "유럽과 미주 지역으로 수출의 길을 열다": "Opened export channels to Europe and the Americas", "기술개발과 생산성 향상을 이어가다": "Continued technical development and productivity improvements",
      "설비 확장과 인력 양성으로 생산성 향상": "Expanded facilities and trained staff to improve productivity", "수출 시장 확대와 해외 판로 개척": "Expanded export markets and overseas sales channels", "다양한 주방기기 제품을 개발·공급": "Developed and supplied a wider range of kitchen equipment", "롯데·신세계 등 주요 백화점 입점": "Listed at major department stores, including Lotte and Shinsegae", "품질과 디자인 경쟁력을 강화": "Strengthened quality and design competitiveness",
      "시장 변화에 맞춰 사업 방향을 재정비": "Adjusted business direction to meet market changes", "중국 천진에 생산 공장 설립": "Established a production factory in Tianjin, China", "유럽 지역 수출을 지속": "Continued exports to Europe", "중국 현지 백화점과 유통망에 공급": "Supplied local department stores and distribution networks in China", "새로운 시장과 운영 기반을 구축": "Built a foundation for new markets and operations",
      "새로운 성장 기반을 다지고 사업을 확장": "Built a new growth platform and expanded operations", "홍콩국제무역유한공사 설립": "Hong Kong International Trading established", "국내외 유통·외식 업체 공급망 확대": "Expanded supply to domestic and international retailers and food-service businesses", "독일, 벨기에, 캐나다 등으로 수출": "Exported to Germany, Belgium, Canada, and other markets", "품질 개선과 신상품 개발을 계속하다": "Continued quality improvement and new product development",
      "All rights reserved.": "All rights reserved.", "키친프라이드 홈": "Kitchen Pride home", "메뉴 열기": "Open menu", "메뉴 닫기": "Close menu", "팝업 닫기": "Close popup"
    },
    vi: {
      "매일의 주방을 더 든든하게, 키친프라이드": "Đồng hành vững chắc cho mọi căn bếp, Kitchen Pride",
      "제품 카테고리": "Sản phẩm", "브랜드 이야기": "Câu chuyện thương hiệu", "문의하기": "Liên hệ",
      "상담 요청": "Yêu cầu tư vấn", "제품 둘러보기": "Khám phá sản phẩm", "전문가 상담": "Tư vấn chuyên gia",
      "좋은 주방의 시작, 키친프라이드": "Khởi đầu căn bếp tốt hơn cùng Kitchen Pride",
      "매일 바쁘게 돌아가는 주방일수록, 믿을 수 있는 장비가 필요하니까. 오래 쓰고 싶은 업소용 주방의 기준을 만듭니다.": "Căn bếp bận rộn cần thiết bị đáng tin cậy. Chúng tôi mang đến tiêu chuẩn thiết bị bếp thương mại bền lâu.",
      "가게의 규모와 동선에 꼭 맞는 주방 설비를 함께 고민합니다.": "Cùng bạn chọn thiết bị phù hợp với quy mô và luồng vận hành của bếp.",
      "주방의 든든한 파트너": "Đối tác tin cậy của căn bếp", "고민부터 설치까지, 한 번에": "Từ tư vấn đến lắp đặt",
      "업소 맞춤 제품 제안": "Giải pháp phù hợp từng mô hình", "믿을 수 있는 품질": "Chất lượng đáng tin cậy", "빠르고 친절한 상담": "Tư vấn nhanh chóng, tận tình",
      "주방에 필요한 모든 것,": "Mọi thứ căn bếp cần,", "한곳에서 만나보세요.": "đều có tại một nơi.",
      "작은 조리 도구부터 핵심 설비까지 주방의 흐름을 생각해 준비했습니다.": "Từ dụng cụ nấu ăn đến thiết bị thiết yếu, được chọn theo nhịp vận hành của căn bếp.",
      "업소용 냉장고": "Tủ lạnh công nghiệp", "신선함을 오래 지키는 냉장 솔루션": "Giải pháp bảo quản độ tươi lâu dài",
      "업소용 튀김기": "Máy chiên công nghiệp", "다양한 주방 환경에 맞춘 튀김기 시리즈": "Dòng máy chiên phù hợp nhiều mô hình bếp",
      "주방용품": "Đồ dùng nhà bếp", "손이 자주 가는 도구부터 꼼꼼하게": "Chu đáo từ những dụng cụ dùng hằng ngày",
      "주방의 오늘을 알고,": "Thấu hiểu căn bếp hôm nay,", "내일을 준비합니다.": "sẵn sàng cho ngày mai.",
      "좋은 장비는 주방의 리듬을 바꿉니다. 키친프라이드는 현장의 목소리를 먼저 듣고, 공간과 메뉴에 꼭 맞는 제품을 제안합니다. 처음 시작하는 주방에도, 더 나은 내일을 준비하는 주방에도 든든한 파트너가 되겠습니다.": "Thiết bị phù hợp tạo nên nhịp vận hành hiệu quả. Kitchen Pride lắng nghe nhu cầu thực tế và đề xuất sản phẩm phù hợp với không gian, thực đơn của bạn. Chúng tôi luôn đồng hành cùng căn bếp mới và những căn bếp đang hướng tới tương lai tốt hơn.",
      "현장을 이해하는 제안": "Tư vấn thấu hiểu thực tế", "업종과 공간에 맞춘 실용적인 구성": "Cấu hình thiết thực theo ngành nghề và không gian",
      "검증된 제품의 기준": "Sản phẩm được tuyển chọn", "매일 쓰는 장비일수록 꼼꼼하게": "Chọn kỹ thiết bị sử dụng mỗi ngày",
      "편안한 상담 경험": "Tư vấn thân thiện", "처음 문의부터 설치까지 친절하게": "Hỗ trợ tận tình từ lúc hỏi đến khi lắp đặt",
      "오래 가는 파트너십": "Quan hệ hợp tác bền lâu", "구매 후에도 이어지는 지원": "Tiếp tục hỗ trợ sau khi mua hàng",
      "우리 가게에 맞는 장비,": "Thiết bị phù hợp với cửa hàng,", "함께 찾아볼까요?": "cùng tìm nhé?",
      "원하는 제품이나 주방 고민을 들려주세요. 친절하게 안내해 드립니다.": "Hãy chia sẻ sản phẩm bạn cần hoặc vấn đề của căn bếp. Chúng tôi sẵn lòng tư vấn.",
      "전화하기": "Gọi điện", "Google 지도에서 보기 ↗": "Xem trên Google Maps ↗", "키친프라이드 소식과 제품 카탈로그": "Tin tức và danh mục sản phẩm Kitchen Pride",
      "이미지를 누르면 큰 화면으로 볼 수 있습니다.": "Chọn ảnh để xem kích thước lớn.", "닫기": "Đóng",
      "시기를 선택해 주요 발자취를 살펴보세요.": "Chọn một giai đoạn để xem các dấu mốc.", "키보드 방향키로도 이동할 수 있습니다.": "Bạn cũng có thể dùng phím mũi tên để di chuyển.",
      "좋은 주방을 향한": "Hành trình hướng đến", "키친프라이드의 발자취": "căn bếp tốt hơn",
      "작은 시작에서 쌓아온 기술과 현장의 경험. 시대의 변화에 맞춰 더 나은 주방을 고민해 온 키친프라이드의 이야기를 소개합니다.": "Từ khởi đầu khiêm tốn, chúng tôi tích lũy kỹ thuật và kinh nghiệm thực tế, luôn tìm cách cải thiện căn bếp theo từng đổi thay của thời đại.",
      "시대마다 이어온": "Những chặng đường", "도전과 성장": "phát triển và đổi mới", "기반형성기": "Giai đoạn nền tảng", "고도성장기": "Giai đoạn phát triển", "전환기": "Giai đoạn chuyển đổi", "재도약기": "Giai đoạn bứt phá",
      "1962년 설립 이후 스테인리스 냉연 강판과 양식기 생산을 시작했습니다. 위생적인 주방 환경을 위한 소재와 제조 기술의 기반을 다지며 국내 주방용품 산업의 성장에 함께했습니다.": "Thành lập năm 1962, công ty bắt đầu sản xuất thép không gỉ cán nguội và đồ dùng bàn ăn. Chúng tôi xây dựng nền tảng vật liệu và kỹ thuật sản xuất cho căn bếp vệ sinh, đồng hành cùng ngành đồ bếp Hàn Quốc.",
      "수출 협력과 제품 개발을 확대하며 성장의 속도를 높였습니다. 디자인과 품질을 꾸준히 개선하고 국내 주요 백화점에 제품을 공급하며 시장을 넓혀갔습니다.": "Chúng tôi mở rộng hợp tác xuất khẩu và phát triển sản phẩm, liên tục cải thiện thiết kế, chất lượng và đưa sản phẩm vào các trung tâm thương mại lớn tại Hàn Quốc.",
      "1990년대 시장 변화 속에서 새로운 생산 기반을 마련했습니다. 1993년 중국 천진에 공장을 세우고 유럽 수출과 중국 내 유통을 이어가며 다음 성장을 준비했습니다.": "Trước biến động thị trường thập niên 1990, chúng tôi xây dựng cơ sở sản xuất mới. Năm 1993, nhà máy tại Thiên Tân, Trung Quốc đi vào hoạt động, phục vụ xuất khẩu sang châu Âu và phân phối nội địa.",
      "해외 무역과 공급망을 넓히며 다양한 외식 브랜드와 거래처에 제품을 공급하고 있습니다. 꾸준한 품질 개선과 신상품 개발로 새로운 도전을 이어갑니다.": "Chúng tôi mở rộng thương mại quốc tế và mạng lưới cung ứng, phục vụ nhiều thương hiệu ẩm thực và đối tác. Việc cải tiến chất lượng và phát triển sản phẩm mới vẫn được tiếp tục.",
      "하노이 직영점 오픈 안내": "Khai trương cửa hàng trực tiếp tại Hà Nội", "업소용 냉장고 상세 카탈로그 이미지": "Danh mục tủ lạnh công nghiệp",
      "주방용품 카탈로그": "Danh mục đồ dùng nhà bếp", "전체 카탈로그 보기": "Xem toàn bộ danh mục", "제품 사양": "Thông số kỹ thuật", "주요 특징": "Đặc điểm nổi bật",
      "모델명": "Mã sản phẩm", "외형 크기": "Kích thước", "중량": "Trọng lượng", "정격전력": "Công suất định mức", "전원": "Nguồn điện", "온도 범위": "Dải nhiệt độ",
      "냉장 용량": "Dung tích làm mát", "냉동 용량": "Dung tích đông lạnh", "냉장 전용": "Chỉ làm mát", "냉동 전용": "Chỉ đông lạnh", "냉장·냉동 조합": "Kết hợp mát / đông lạnh",
      "제품 상세 보기": "Xem chi tiết sản phẩm", "자세히 보기": "Tìm hiểu thêm", "이전": "Trước", "다음": "Tiếp", "페이지를 찾을 수 없습니다.": "Không tìm thấy trang.",
      "간접냉각방식 업소용 냉장고": "Tủ lạnh công nghiệp làm lạnh gián tiếp", "25BOX, 45BOX, 65BOX 모델과 카탈로그 사양을 확인하세요.": "Tham khảo các mẫu 25BOX, 45BOX, 65BOX và thông số trong danh mục.",
      "업소용 튀김기. 하이브리드, 프리미엄, 에코, 스마트, 터보, 자동 시리즈를 만나보세요.": "Khám phá các dòng máy chiên công nghiệp Hybrid, Premium, Eco, Smart, Turbo và Automatic.",
      "주방용품 및 업소용 조리기기 제품군. 도매, 상담, 설계, 주문 제작을 안내합니다.": "Đồ dùng nhà bếp và thiết bị nấu công nghiệp. Tư vấn bán sỉ, thiết kế và đặt hàng theo yêu cầu.",
      "모델 상세": "Chi tiết sản phẩm", "전체 모델 보기": "Xem tất cả mẫu", "이 모델 상담하기": "Tư vấn mẫu này",
      "모델 정보를 불러오는 중입니다": "Đang tải thông tin sản phẩm", "모델 정보를 찾을 수 없습니다.": "Không tìm thấy thông tin sản phẩm.", "냉장고 모델 목록에서 제품을 다시 선택해 주세요.": "Vui lòng chọn lại sản phẩm trong danh sách tủ lạnh.", "냉장고 모델 목록": "Danh sách tủ lạnh",
      "글라스 도어 선택": "Tùy chọn cửa kính", "표기 사양은 제공된 EVERZEN 카탈로그 기준입니다. 제품 구성과 설치 조건은 상담 시 확인해 주세요.": "Thông số dựa trên danh mục EVERZEN được cung cấp. Vui lòng xác nhận cấu hình và điều kiện lắp đặt khi tư vấn.",
      "냉장·저장": "Làm lạnh & bảo quản", "조리·구이": "Nấu & nướng", "전처리·가공": "Sơ chế & chế biến", "식기·냄비": "Đồ ăn & nồi chảo", "도구·주방 보조": "Dụng cụ & phụ kiện bếp",
      "하이브리드": "Hybrid", "프리미엄": "Premium", "에코": "Eco", "스마트": "Smart", "터보": "Turbo", "자동": "Tự động",
      "신상품 다량입하": "Nhiều sản phẩm mới", "주방용품 한 자리에서 준비 끝": "Đầy đủ đồ dùng nhà bếp tại một nơi",
      "필요한 구성으로 선택하는": "Chọn cấu hình phù hợp", "간접냉각 냉장고": "tủ lạnh làm lạnh gián tiếp",
      "에버젠 간접냉각방식 냉장고의 BOX별 구성과 모델 정보를 카탈로그 기준으로 정리했습니다. 냉장·냉동 조합, 도어 형태와 설치 치수를 비교해 보세요.": "Thông tin mẫu tủ lạnh EVERZEN làm lạnh gián tiếp được tổng hợp theo danh mục. Hãy so sánh cấu hình làm mát/đông lạnh, kiểu cửa và kích thước lắp đặt.",
      "모델 살펴보기": "Xem các mẫu", "제품 상담": "Tư vấn sản phẩm", "간접냉각방식": "Làm lạnh gián tiếp", "냉장·냉동 조합": "Kết hợp mát / đông lạnh", "양문형 옵션": "Tùy chọn cửa đôi",
      "모델별 사양": "Thông số từng mẫu", "사양은 제공해 주신 EVERZEN 카탈로그를 기준으로 옮겼습니다.": "Thông số được tổng hợp theo danh mục EVERZEN bạn cung cấp.", "모델별 구성을 확인한 뒤 상담을 요청해 주세요.": "Vui lòng xem cấu hình từng mẫu và liên hệ để được tư vấn.",
      "양문형": "Cửa đôi", "대용량": "Dung tích lớn", "도어 옵션": "Tùy chọn cửa", "냉장 전용 또는 냉동 전용 모델로 구성됩니다.": "Có mẫu chỉ làm mát hoặc chỉ đông lạnh.", "냉장·냉동 용량 조합에 따라 네 가지 모델을 선택할 수 있습니다.": "Có bốn mẫu với các mức dung tích làm mát và đông lạnh khác nhau.",
      "넉넉한 수납 구성이 가능합니다.": "Cấu hình lưu trữ rộng rãi.", "냉장 온도 범위": "Dải nhiệt độ làm mát", "필요한 모델을 찾지 못하셨나요?": "Bạn chưa tìm thấy mẫu phù hợp?", "설치 공간과 필요한 용량을 알려주시면 안내해 드립니다.": "Hãy cho chúng tôi biết không gian lắp đặt và dung tích cần thiết.",
      "새로 추가된 제품을": "Khám phá sản phẩm mới", "사진으로 만나보세요.": "qua hình ảnh.", "업소용 세척·소독·보온 설비와 그릴 제품 사진을 추가했습니다.": "Đã bổ sung ảnh thiết bị rửa, khử trùng, giữ ấm và nướng công nghiệp.",
      "업소용 식기세척기": "Máy rửa chén công nghiệp", "식기세척기 제품 이미지": "Hình ảnh máy rửa chén", "식기세척기": "Máy rửa chén", "식기세척기 구성": "Cấu hình máy rửa chén", "업소용 보온고": "Tủ giữ nóng công nghiệp", "DS-120 보온고": "Tủ giữ nóng DS-120", "스테인리스 주방 장비": "Thiết bị bếp thép không gỉ", "업소용 그릴": "Vỉ nướng công nghiệp",
      "주방에 필요한 제품을": "Tìm sản phẩm phù hợp", "용도에 맞게 살펴보세요.": "với nhu cầu căn bếp.", "아래 제품군은 제공된 키친프라이드 카탈로그 이미지에 기재된 항목을 기준으로 정리했습니다.": "Danh mục bên dưới dựa trên các sản phẩm trong hình ảnh danh mục Kitchen Pride bạn cung cấp.", "세부 모델과 재고, 사양은 문의해 주세요.": "Vui lòng liên hệ để biết mẫu, tình trạng hàng và thông số.",
      "냉장·저장 설비": "Thiết bị làm lạnh & bảo quản", "조리·구이 기기": "Thiết bị nấu & nướng", "전처리·가공 기기": "Thiết bị sơ chế & chế biến", "식기·냄비·팬": "Đồ ăn, nồi & chảo", "도구·주방 보조": "Dụng cụ & phụ kiện bếp",
      "원하는 품목과 사용 환경을 알려주시면 상담을 통해 제품과 구성을 안내해 드립니다.": "Hãy cho chúng tôi biết sản phẩm cần tìm và môi trường sử dụng để được tư vấn cấu hình.", "제품 상담하기": "Tư vấn sản phẩm", "필요한 주방용품과 구성,": "Đồ dùng và cấu hình bếp cần thiết,", "함께 찾아보겠습니다.": "cùng tìm giải pháp phù hợp.", "제품명이나 필요한 용도를 알려주시면 상담해 드립니다.": "Hãy cho chúng tôi biết tên sản phẩm hoặc mục đích sử dụng để được tư vấn.",
      "이 모델이 우리 주방에 맞을지 함께 확인해 보세요.": "Cùng kiểm tra mẫu này có phù hợp với bếp của bạn không.", "모델명과 설치 공간을 알려주시면 안내해 드립니다.": "Hãy cho chúng tôi biết mã sản phẩm và không gian lắp đặt.", "대표 나이권": "Đại diện Na I-kwon", "모델 상세": "Chi tiết sản phẩm",
      "65BOX 글라스 도어 구성. 냉장·냉동 칸에 따라 선택 가능한 도어 옵션이 다르므로 상담 시 확인해 주세요.": "Cấu hình cửa kính 65BOX. Tùy chọn cửa khác nhau tùy ngăn mát hay ngăn đông; vui lòng xác nhận khi liên hệ.",
      "주방의 리듬에 맞춘": "Theo nhịp vận hành căn bếp", "시리즈 살펴보기": "Khám phá các dòng", "주방에 맞는 시리즈를": "So sánh các dòng", "비교해 보세요.": "phù hợp với căn bếp.",
      "키친프라이드의 튀김기 시리즈를 한곳에서 살펴보세요. 제품 사진과 구성은 제공된 이미지 기준으로 소개하며, 상세 사양과 모델은 상담을 통해 확인하실 수 있습니다.": "Khám phá các dòng máy chiên Kitchen Pride. Hình ảnh và cấu hình dựa trên tài liệu được cung cấp; vui lòng liên hệ để biết mẫu và thông số chi tiết.", "시리즈별 제품 이미지를 먼저 확인하고,": "Xem hình ảnh sản phẩm theo từng dòng,", "필요한 용량과 설치 조건은 상담으로 안내받으세요.": "sau đó liên hệ để được tư vấn dung tích và điều kiện lắp đặt.",
      "여러 형태의 제품 구성을 사진으로 확인해 보세요. 세부 모델과 사양은 문의 시 안내해 드립니다.": "Xem ảnh các cấu hình sản phẩm. Vui lòng liên hệ để biết mẫu và thông số chi tiết.", "현재 보유한 프리미엄 제품 사진을 보여드립니다. 추가 사진과 실제 제품 옵션은 문의해 주세요.": "Xem hình ảnh các sản phẩm Premium hiện có. Vui lòng liên hệ để biết thêm ảnh và tùy chọn.", "에코 튀김기 시리즈의 제품 구성을 사진으로 확인해 보세요. 실제 제품 옵션은 별도 문의 바랍니다.": "Xem ảnh cấu hình máy chiên Eco. Vui lòng liên hệ riêng để biết các tùy chọn thực tế.", "스마트 시리즈 제품군을 살펴보세요. 모델별 제어 기능과 상세 구성은 상담해 드립니다.": "Khám phá dòng Smart. Chúng tôi sẽ tư vấn chức năng điều khiển và cấu hình từng mẫu.", "터보 시리즈 제품 이미지를 확인해 보세요. 설치 환경과 사용 목적에 맞는 제품은 상담으로 안내해 드립니다.": "Xem hình ảnh dòng Turbo. Chúng tôi sẽ tư vấn sản phẩm phù hợp với không gian và mục đích sử dụng.", "자동 튀김기 제품 사진입니다. 제품 구성과 사용 환경에 맞는 상세 정보는 문의해 주세요.": "Hình ảnh máy chiên tự động. Vui lòng liên hệ để biết cấu hình phù hợp với nhu cầu sử dụng.",
      "주방 환경에 맞는 튀김기,": "Máy chiên phù hợp với căn bếp,", "관심 있는 시리즈와 필요한 구성을 알려주시면 안내해 드립니다.": "Hãy cho chúng tôi biết dòng sản phẩm và cấu hình bạn cần để được tư vấn.", "주방용품 한자리에서,": "Đồ dùng nhà bếp tại một nơi,", "준비를 더 든든하게.": "chuẩn bị căn bếp chu đáo hơn.", "매일 쓰는 조리 도구부터 업소용 주방기기까지. 필요한 제품을 살펴보고, 주방 환경에 맞는 구성과 주문 제작을 상담해 보세요.": "Từ dụng cụ nấu ăn hằng ngày đến thiết bị bếp công nghiệp, hãy tham khảo sản phẩm và tư vấn cấu hình hoặc đặt hàng theo nhu cầu.",
      "제품군 둘러보기": "Xem danh mục", "주방용품·주방기기 도매": "Bán sỉ đồ dùng và thiết bị bếp", "상담·설계·주문 제작": "Tư vấn, thiết kế và đặt hàng", "빠른 배송·A/S 안내": "Giao hàng nhanh và bảo hành", "제품 사진 보기 ↗": "Xem ảnh sản phẩm ↗", "블로그 소식 보기 ↗": "Đọc tin trên blog ↗",
      "All rights reserved.": "Đã đăng ký bản quyền.", "키친프라이드 홈": "Trang chủ Kitchen Pride", "메뉴 열기": "Mở menu", "메뉴 닫기": "Đóng menu", "팝업 닫기": "Đóng cửa sổ"
    }
  };

  const originalNodes = new Map();
  const attrTranslations = {
    "주요 메뉴": { en: "Main menu", vi: "Menu chính" },
    "키친프라이드 연혁": { en: "Kitchen Pride history", vi: "Lịch sử Kitchen Pride" },
    "키친프라이드 하노이 매장 구글 지도": { en: "Google map to the Kitchen Pride Hanoi store", vi: "Bản đồ Google đến cửa hàng Kitchen Pride tại Hà Nội" }
  };
  const pageTitles = {
    en: { "키친프라이드 | 매일의 주방을 든든하게": "Kitchen Pride | Your trusted kitchen partner", "브랜드 이야기 | 키친프라이드": "Our Story | Kitchen Pride", "주방용품 | 키친프라이드": "Kitchenware | Kitchen Pride", "업소용 튀김기 | 키친프라이드": "Commercial Fryers | Kitchen Pride", "업소용 냉장고 | 키친프라이드": "Commercial Refrigerators | Kitchen Pride", "에버젠 업소용 냉장고 | 키친프라이드": "EVERZEN Commercial Refrigerators | Kitchen Pride", "제품 상세 | 키친프라이드": "Product Details | Kitchen Pride" },
    vi: { "키친프라이드 | 매일의 주방을 든든하게": "Kitchen Pride | Đối tác tin cậy của căn bếp", "브랜드 이야기 | 키친프라이드": "Câu chuyện thương hiệu | Kitchen Pride", "주방용품 | 키친프라이드": "Đồ dùng nhà bếp | Kitchen Pride", "업소용 튀김기 | 키친프라이드": "Máy chiên công nghiệp | Kitchen Pride", "업소용 냉장고 | 키친프라이드": "Tủ lạnh công nghiệp | Kitchen Pride", "에버젠 업소용 냉장고 | 키친프라이드": "Tủ lạnh công nghiệp EVERZEN | Kitchen Pride", "제품 상세 | 키친프라이드": "Chi tiết sản phẩm | Kitchen Pride" }
  };

  const languageControl = document.createElement("div");
  languageControl.className = "language-control";
  languageControl.setAttribute("aria-label", "Language");
  languageControl.innerHTML = `<label class="visually-hidden" for="site-language">Language</label><select id="site-language"><option value="ko">한국어</option><option value="en">English</option><option value="vi">Tiếng Việt</option></select>`;
  document.querySelector(".nav-links")?.append(languageControl);
  const selector = languageControl.querySelector("select");
  if (!selector) return;

  function applyLanguage(language) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      if (!originalNodes.has(node)) originalNodes.set(node, node.nodeValue);
      const original = originalNodes.get(node);
      const key = original.trim().replace(/\s+/g, " ");
      const translated = language === "ko" ? original.trim() : (translations[language]?.[key] ?? (language === "vi" ? translations.en?.[key] : undefined) ?? key);
      const leading = original.match(/^\s*/)?.[0] ?? "";
      const trailing = original.match(/\s*$/)?.[0] ?? "";
      node.nodeValue = `${leading}${translated}${trailing}`;
    }
    document.documentElement.lang = language;
    document.querySelectorAll("[aria-label]").forEach(element => {
      const original = element.dataset.originalAriaLabel ?? element.getAttribute("aria-label");
      element.dataset.originalAriaLabel = original;
      if (language === "ko") element.setAttribute("aria-label", original);
      else if (attrTranslations[original]?.[language]) element.setAttribute("aria-label", attrTranslations[original][language]);
    });
    const title = document.querySelector("title");
    if (title) {
      const original = title.dataset.originalTitle ?? title.textContent;
      title.dataset.originalTitle = original;
      const baseTitle = pageTitles[language]?.[original];
      title.textContent = language === "ko" ? original : (baseTitle ?? original
        .replace("에버젠 업소용 냉장고", language === "en" ? "EVERZEN Commercial Refrigerator" : "Tủ lạnh công nghiệp EVERZEN")
        .replace("키친프라이드", "Kitchen Pride"));
    }
    document.querySelectorAll('meta[name="description"]').forEach(meta => {
      const original = meta.dataset.originalContent ?? meta.content;
      meta.dataset.originalContent = original;
      if (language !== "ko") meta.content = language === "en" ? "Kitchen Pride — reliable commercial refrigerators, fryers, and kitchen equipment." : "Kitchen Pride — tủ lạnh, máy chiên và thiết bị bếp thương mại đáng tin cậy.";
      else meta.content = original;
    });
    try { localStorage.setItem("kitchenpride-language", language); } catch (_) {}
  }

  let savedLanguage = "ko";
  try { savedLanguage = localStorage.getItem("kitchenpride-language") || "ko"; } catch (_) {}
  selector.value = ["ko", "en", "vi"].includes(savedLanguage) ? savedLanguage : "ko";
  selector.addEventListener("change", () => applyLanguage(selector.value));
  applyLanguage(selector.value);
})();


