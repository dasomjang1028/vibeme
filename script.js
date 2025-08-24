// ==========================================================================
// 바이브 미 (Vibe Me) - 인터랙티브 기능
// ==========================================================================

// DOM 요소들
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const contactButton = document.getElementById('contactButton');
const contactModal = document.getElementById('contactModal');
const modalCloseButton = document.getElementById('modalCloseButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const copyButtons = document.querySelectorAll('.copy-button');
const blobs = document.querySelectorAll('.blob');
const emailButton = document.getElementById('emailButton');
const typingText = document.getElementById('typingText');
const statItems = document.querySelectorAll('.stat-item');
const skillBars = document.querySelectorAll('.skill-progress');

// ==========================================================================
// 타이핑 애니메이션
// ==========================================================================

const typingTexts = [
    "Portfolio", 
    "Design Studio", 
    "Creative Space", 
    "UX/UI Hub",
    "Art Gallery"
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = typingTexts[currentTextIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && currentCharIndex === currentText.length) {
        // 텍스트 완성 후 잠시 대기
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeText, typingSpeed);
}

// 타이핑 애니메이션 시작
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
});

// ==========================================================================
// Stats 카운터 애니메이션
// ==========================================================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target.querySelector('.stat-number');
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(numberElement, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// 관찰 시작
document.addEventListener('DOMContentLoaded', () => {
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// ==========================================================================
// 스킬바 애니메이션
// ==========================================================================

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillProgress = entry.target;
            const width = skillProgress.getAttribute('data-width');
            
            setTimeout(() => {
                skillProgress.style.width = width + '%';
            }, 500);
            
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.7 });

// 스킬바 관찰 시작
document.addEventListener('DOMContentLoaded', () => {
    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
});

// ==========================================================================
// 이메일 기능 개선
// ==========================================================================

// 이메일 버튼 클릭 시 복사 기능도 추가
if (emailButton) {
    emailButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 실제 이메일 클라이언트 열기
        window.location.href = 'mailto:dasom.jang@example.com?subject=안녕하세요!&body=안녕하세요 다솜님,%0D%0A%0D%0A';
        
        // 복사도 함께 실행
        copyToClipboard('dasom.jang@example.com', null);
        
        // 시각적 피드백
        const originalText = emailButton.querySelector('.contact-text').textContent;
        emailButton.querySelector('.contact-text').textContent = '이메일 복사됨!';
        emailButton.style.background = 'var(--secondary-color)';
        
        setTimeout(() => {
            emailButton.querySelector('.contact-text').textContent = originalText;
            emailButton.style.background = '';
        }, 2000);
    });
}

// ==========================================================================
// 다크 모드 토글 기능
// ==========================================================================

// 현재 테마 확인 (로컬 스토리지에서 가져오거나 시스템 설정 사용)
function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    // 시스템 다크 모드 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 테마 적용 함수
function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeToggle.setAttribute('aria-label', '라이트 모드 토글');
    } else {
        root.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeToggle.setAttribute('aria-label', '다크 모드 토글');
    }
    
    // 로컬 스토리지에 테마 저장
    localStorage.setItem('theme', theme);
}

// 테마 토글 함수
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 부드러운 전환을 위한 애니메이션
    document.body.style.transition = 'all 0.3s ease-in-out';
    
    applyTheme(newTheme);
    
    // 토글 버튼 애니메이션
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
}

// 초기 테마 설정
document.addEventListener('DOMContentLoaded', () => {
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme);
});

// 테마 토글 버튼 이벤트 리스너
themeToggle.addEventListener('click', toggleTheme);

// 시스템 테마 변경 감지
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // 사용자가 직접 설정한 테마가 없을 때만 시스템 테마 따라가기
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// ==========================================================================
// 연락처 모달 기능
// ==========================================================================

// 모달 열기
function openModal() {
    contactModal.showModal();
    document.body.style.overflow = 'hidden';
    
    // 모달 열림 애니메이션
    contactModal.style.opacity = '0';
    contactModal.style.transform = 'scale(0.8)';
    
    requestAnimationFrame(() => {
        contactModal.style.transition = 'all 0.3s ease-out';
        contactModal.style.opacity = '1';
        contactModal.style.transform = 'scale(1)';
    });
}

// 모달 닫기
function closeModal() {
    contactModal.style.transition = 'all 0.2s ease-in';
    contactModal.style.opacity = '0';
    contactModal.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        contactModal.close();
        document.body.style.overflow = '';
    }, 200);
}

// 모달 이벤트 리스너들
contactButton.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// ESC 키로 모달 닫기
contactModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==========================================================================
// 복사 기능
// ==========================================================================

// 클립보드에 텍스트 복사
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // 복사 성공 피드백
        const originalText = button.textContent;
        button.textContent = '✅ 복사됨!';
        button.style.background = 'var(--secondary-color)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
        
    } catch (err) {
        console.error('복사 실패:', err);
        
        // 복사 실패 피드백
        const originalText = button.textContent;
        button.textContent = '❌ 복사 실패';
        button.style.background = 'var(--primary-color)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// 복사 버튼들에 이벤트 리스너 추가
copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = button.getAttribute('data-copy');
        copyToClipboard(textToCopy, button);
    });
});

// ==========================================================================
// 스크롤 애니메이션 (교차점 관찰자 API 사용)
// ==========================================================================

// 요소가 뷰포트에 들어올 때 애니메이션 실행
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 관찰할 요소들 설정
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(`
        .link-item, 
        .contact-section, 
        .skill-category, 
        .project-card,
        .section-header
    `);
    
    animatedElements.forEach((el, index) => {
        // 초기 상태 설정
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        
        observer.observe(el);
    });
});

// ==========================================================================
// 버튼 리플 효과
// ==========================================================================

// 버튼 클릭 시 리플 효과 생성
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 리플 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 모든 버튼에 리플 효과 추가
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.link-button, .contact-button, .theme-toggle');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
});

// ==========================================================================
// 접근성 개선
// ==========================================================================

// 키보드 네비게이션 지원
document.addEventListener('keydown', (e) => {
    // Tab 키로 포커스 이동 시 스타일 개선
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// 마우스 클릭 시 키보드 네비게이션 스타일 제거
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// 키보드 네비게이션 스타일
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

// ==========================================================================
// 애니메이션 배경 인터랙션
// ==========================================================================

let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

// 마우스 위치 추적
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    // 마우스 이동 시 블럽들이 반응하도록 함
    updateBlobPositions();
    
    // 마우스가 멈추면 원래 위치로 돌아가도록 타이머 설정
    clearTimeout(window.mouseStopTimer);
    window.mouseStopTimer = setTimeout(() => {
        isMouseMoving = false;
        resetBlobPositions();
    }, 2000);
});

// 블럽 위치 업데이트 함수
function updateBlobPositions() {
    blobs.forEach((blob, index) => {
        const rect = blob.getBoundingClientRect();
        const blobCenterX = rect.left + rect.width / 2;
        const blobCenterY = rect.top + rect.height / 2;
        
        // 마우스와 블럽 간의 거리 계산
        const distance = Math.sqrt(
            Math.pow(mouseX - blobCenterX, 2) + Math.pow(mouseY - blobCenterY, 2)
        );
        
        // 영향을 받는 최대 거리
        const maxDistance = 300;
        const speed = parseFloat(blob.getAttribute('data-speed')) || 0.5;
        
        if (distance < maxDistance) {
            // 마우스에서 멀어지는 방향 계산
            const angle = Math.atan2(blobCenterY - mouseY, blobCenterX - mouseX);
            const force = (maxDistance - distance) / maxDistance;
            
            // 이동 거리 계산
            const moveX = Math.cos(angle) * force * 100 * speed;
            const moveY = Math.sin(angle) * force * 100 * speed;
            
            // 색상 변화 계산 (거리에 따라)
            const intensity = force * 0.5;
            
            // 블럽 이동 및 색상 변화 적용
            blob.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.2})`;
            blob.style.opacity = Math.max(0.3, 1 - intensity);
            
            // 블러 효과 증가
            blob.style.filter = `blur(${60 + force * 40}px)`;
        }
    });
}

// 블럽 위치 리셋 함수
function resetBlobPositions() {
    blobs.forEach((blob) => {
        blob.style.transform = '';
        blob.style.opacity = '';
        blob.style.filter = '';
    });
}

// 패럴랙스 스크롤 효과
let ticking = false;

function updateParallax() {
    const scrollY = window.pageYOffset;
    
    blobs.forEach((blob, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollY * speed);
        blob.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// 윈도우 리사이즈 시 블럽 위치 재조정
window.addEventListener('resize', () => {
    resetBlobPositions();
});

// 터치 디바이스 지원
let touchX = 0;
let touchY = 0;

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    
    // 터치 위치를 마우스 위치로 사용
    mouseX = touchX;
    mouseY = touchY;
    isMouseMoving = true;
    
    updateBlobPositions();
}, { passive: false });

document.addEventListener('touchend', () => {
    setTimeout(() => {
        isMouseMoving = false;
        resetBlobPositions();
    }, 1000);
});

// 성능 최적화: RAF를 사용한 부드러운 애니메이션
let rafId;

function animateBlobs() {
    if (isMouseMoving) {
        updateBlobPositions();
    }
    
    rafId = requestAnimationFrame(animateBlobs);
}

// 애니메이션 시작
animateBlobs();

// 페이지 언로드 시 애니메이션 정리
window.addEventListener('beforeunload', () => {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
});

// 디바이스 모션 지원 (모바일)
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (e) => {
        const acceleration = e.accelerationIncludingGravity;
        if (acceleration.x || acceleration.y) {
            // 디바이스 기울기에 따라 블럽들이 움직임
            blobs.forEach((blob, index) => {
                const sensitivity = 0.5;
                const moveX = acceleration.x * sensitivity * (index + 1);
                const moveY = acceleration.y * sensitivity * (index + 1);
                
                blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }
    });
}

// ==========================================================================
// 인터랙티브 커서 효과
// ==========================================================================

// 커스텀 커서 생성
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

// 커서 스타일 추가
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    }
    
    .cursor-follower {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s ease;
        opacity: 0.5;
    }
    
    .custom-cursor.hover {
        transform: scale(1.5);
        background: var(--accent-color);
    }
    
    .cursor-follower.hover {
        transform: scale(1.5);
        border-color: var(--accent-color);
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);

let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// 커서 위치 업데이트
document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

// 부드러운 팔로워 움직임
function updateCursor() {
    const speed = 0.15;
    
    followerX += (cursorX - followerX) * speed;
    followerY += (cursorY - followerY) * speed;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    cursorFollower.style.left = followerX - 20 + 'px';
    cursorFollower.style.top = followerY - 20 + 'px';
    
    requestAnimationFrame(updateCursor);
}

updateCursor();

// 호버 가능한 요소들에 커서 효과 추가
const hoverElements = document.querySelectorAll(`
    .link-button, 
    .contact-button, 
    .theme-toggle, 
    .project-card, 
    .skill-category,
    .copy-button,
    .contact-link
`);

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

// ==========================================================================
// 부드러운 스크롤 네비게이션
// ==========================================================================

// 섹션들에 ID 추가 (동적으로)
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { element: document.querySelector('.profile-section'), id: 'home' },
        { element: document.querySelector('.stats-section'), id: 'stats' },
        { element: document.querySelector('.skills-section'), id: 'skills' },
        { element: document.querySelector('.projects-section'), id: 'projects' },
        { element: document.querySelector('.contact-section'), id: 'contact' }
    ];
    
    sections.forEach(({ element, id }) => {
        if (element) {
            element.id = id;
        }
    });
});

// 키보드 단축키로 섹션 이동
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        const sections = ['home', 'stats', 'skills', 'projects', 'contact'];
        const key = e.key;
        
        if (key >= '1' && key <= '5') {
            e.preventDefault();
            const sectionId = sections[parseInt(key) - 1];
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// ==========================================================================
// Plus-EX 스타일 호버 이미지 인터랙션
// ==========================================================================

// 마우스 추적 호버 이미지 효과
document.addEventListener('DOMContentLoaded', () => {
    const linkButtons = document.querySelectorAll('.link-button');
    
    linkButtons.forEach(button => {
        const hoverImage = button.querySelector('.hover-image');
        if (!hoverImage) return;
        
        let isHovering = false;
        
        button.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        button.addEventListener('mouseleave', () => {
            isHovering = false;
            // 마우스가 벗어나면 원래 위치로 복귀
            hoverImage.style.transform = '';
        });
        
        button.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // 마우스 위치에 따른 이미지 위치 조정
            const deltaX = (mouseX - centerX) * 0.1;
            const deltaY = (mouseY - centerY) * 0.1;
            
            // 부드러운 추적 효과
            hoverImage.style.transform = `translateY(-50%) scale(1) translate(${deltaX}px, ${deltaY}px)`;
        });
    });
});

// 링크 버튼에 스태거링 애니메이션 추가
document.addEventListener('DOMContentLoaded', () => {
    const linkItems = document.querySelectorAll('.link-item');
    
    const observeLinks = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observeLinks.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    linkItems.forEach(item => {
        observeLinks.observe(item);
    });
});

// ==========================================================================
// 성능 최적화 및 추가 효과
// ==========================================================================

// 프로젝트 카드 3D 효과
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
});

// 스킬 카테고리 호버 효과
document.addEventListener('DOMContentLoaded', () => {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0px) scale(1)';
        });
    });
});
