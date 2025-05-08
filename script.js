let currentPath = [];
let currentLevel = 0;
let savedItems = {};

const categories = {
    wearables: {
        name: '穿戴类',
        subcategories: {
            winter: {
                name: '冬季衣物',
                items: ['加绒外套', '羽绒服', '衬裤', '加绒裤']
            },
            summer: {
                name: '夏季衣物',
                items: ['短裤', '短(长)裙', '连衣裙', '夏季上衣', '夏季短袖', '吊带', '防晒', '泳装']
            },
            spring_autumn: {
                name: '春秋衣物',
                subcategories: {
                    outerwear: {
                        name: '外套',
                        items: ['牛仔外套', '休闲外套', '运动外套']
                    },
                    pants: {
                        name: '裤子',
                        items: ['牛仔裤', '运动裤', '休闲裤']
                    },
                    others: {
                        name: '其他',
                        items: ['打底', '大衣', '马甲', '衬衫', '毛衣', '打底裤', '套装']
                    }
                }
            },
            underwear: {
                name: '内衣',
                items: ['内裤', '胸罩', '袜子']
            },
            shoes: {
                name: '鞋子',
                items: ['板鞋', '运动鞋', '休闲鞋', '靴子', '皮鞋', '帆布鞋', '棉鞋', '凉鞋', '舞鞋', '拖鞋']
            },
            accessories: {
                name: '配饰',
                items: ['帽子', '围巾', '领结', '腰带', '行李包', '腰包', '小挎包', '帆布包', '书包', '手套']
            },
            jewelry: {
                name: '首饰',
                items: ['发圈', '发夹', '发卡', '发带', '簪子', '耳饰', '手链', '戒指', '项链', '胸针']
            }
        }
    },
    bodycare: {
        name: '身体护理类',
        subcategories: {
            skincare: {
                name: '护肤品',
                items: ['手', '唇', '脸']
            },
            makeup: {
                name: '化妆品',
                items: ['肤色', '轮廓', '眉', '眼', '腮红', '口红', '头发', '香水', '身毛', '其他/工具']
            },
            cleaning: {
                name: '清洁用品',
                items: ['毛巾', '搓澡三件套', '梳子', '肥皂', '洗衣液']
            },
            medicine: {
                name: '药品',
                items: ['脊椎病', '皮肤病', '头发', '其他']
            }
        }
    },
    daily: {
        name: '日用品类',
        subcategories: {
            kitchen: {
                name: '厨房用品',
                items: ['餐具', '洗洁精', '厨房电器']
            },
            containers: {
                name: '容器',
                items: ['篮子', '钩子', '置物架', '行李箱', '杯子', '桶盆']
            },
            seasonal: {
                name: '季节用品',
                subcategories: {
                    winter: {
                        name: '冬季保暖',
                        items: []
                    },
                    summer: {
                        name: '夏季降温驱蚊',
                        items: []
                    }
                }
            },
            cards: {
                name: '卡证',
                items: []
            },
            souvenirs: {
                name: '纪念品',
                items: []
            },
            others: {
                name: '其他',
                items: []
            }
        }
    },
    office: {
        name: '办公用品',
        subcategories: {
            stationery: {
                name: '文具',
                items: ['铅笔', '水笔', '荧光笔', '马克笔']
            },
            others: {
                name: '其他',
                items: []
            }
        }
    },
    hobbies: {
        name: '兴趣爱好类',
        subcategories: {
            photography: {
                name: '摄影',
                items: ['支架', '灯光', '拍摄用具', '拍摄道具']
            },
            sewing: {
                name: '缝纫',
                items: []
            },
            sports: {
                name: '运动',
                items: []
            },
            instruments: {
                name: '乐器',
                items: ['吹', '拉', '弹']
            },
            painting: {
                name: '画画',
                items: []
            },
            calligraphy: {
                name: '书法',
                items: []
            }
        }
    },
    investment: {
        name: '韭菜成长日志',
        items: []
    }
};

// 存储当前页面的物品数据
let items = [];

// 从本地存储加载数据
function loadItems() {
    const pathname = window.location.pathname;
    const storedItems = localStorage.getItem(pathname);
    if (storedItems) {
        items = JSON.parse(storedItems);
        displayItems();
    }
}

// 保存数据到本地存储
function saveItems() {
    const pathname = window.location.pathname;
    localStorage.setItem(pathname, JSON.stringify(items));
}

// 显示物品列表页面
function showItemPage(itemName, parentId) {
    currentPath.push({ 
        id: itemName, 
        parentId: parentId,
        name: itemName,
        isItem: true 
    });
    currentLevel++;
    
    const contentDiv = document.getElementById('mainContent');
    contentDiv.innerHTML = `
        <div class="container">
            <div class="search-bar">
                <input type="text" placeholder="搜索...">
                <div class="action-buttons">
                    <button>导入</button>
                    <button>导出</button>
                </div>
            </div>
            <div class="header">
                <button class="back-button" onclick="goBack()">←</button>
                <h1>${itemName}</h1>
            </div>
            <div class="items-container">
                <!-- 已添加的物品将在这里显示 -->
            </div>
            <button class="add-item-button" onclick="addNewItem()">添加物品</button>
        </div>
    `;

    // 加载已保存的物品
    loadItems();

    // 添加事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.querySelector('.search-bar input').addEventListener('input', function(e) {
        const searchText = e.target.value.toLowerCase();
        const itemCards = document.querySelectorAll('.item-card');
        itemCards.forEach(card => {
            const location = card.querySelector('.location-input').value.toLowerCase();
            if (location.includes(searchText)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // 导入按钮
    document.querySelector('.action-buttons button:nth-child(1)').addEventListener('click', importData);

    // 导出按钮
    document.querySelector('.action-buttons button:nth-child(2)').addEventListener('click', exportData);

    // 监听位置输入变化
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('location-input')) {
            saveAllItems();
        }
    });
}

// 添加新物品
function addNewItem() {
    const container = document.querySelector('.items-container');
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    itemCard.innerHTML = `
        <div class="image-upload">
            <input type="file" accept="image/*" onchange="handleImageUpload(this)">
            <div class="placeholder">+</div>
        </div>
        <input type="text" class="location-input" placeholder="位置...">
    `;
    container.appendChild(itemCard);
}

// 处理图片上传
function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageContainer = input.parentElement;
            imageContainer.style.backgroundImage = `url(${e.target.result})`;
            imageContainer.style.backgroundSize = 'cover';
            imageContainer.style.backgroundPosition = 'center';
            const placeholder = imageContainer.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // 保存当前状态
            saveAllItems();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 保存所有物品
function saveAllItems() {
    const cards = document.querySelectorAll('.item-card');
    const items = [];
    
    cards.forEach(card => {
        const location = card.querySelector('.location-input').value;
        const imageContainer = card.querySelector('.image-upload');
        const backgroundImage = imageContainer.style.backgroundImage;
        const image = backgroundImage ? backgroundImage.slice(5, -2) : null;
        
        if (location || image) {  // 允许保存未完成的项目
            items.push({
                location: location,
                image: image
            });
        }
    });
    
    // 保存到本地存储
    const pathname = window.location.pathname;
    localStorage.setItem(pathname, JSON.stringify(items));
}

// 显示已保存的物品
function displaySavedItems() {
    const pathname = window.location.pathname;
    const savedItems = localStorage.getItem(pathname);
    
    if (savedItems) {
        const items = JSON.parse(savedItems);
        const container = document.querySelector('.items-container');
        container.innerHTML = ''; // 清空容器
        
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <div class="image-upload" ${item.image ? `style="background-image: url(${item.image}); background-size: cover; background-position: center;"` : ''}>
                    <input type="file" accept="image/*" onchange="handleImageUpload(this)">
                    <div class="placeholder" ${item.image ? 'style="display: none;"' : ''}>+</div>
                </div>
                <input type="text" class="location-input" value="${item.location || ''}" placeholder="位置...">
            `;
            container.appendChild(itemCard);
        });
    }
}

// 显示所有物品
function displayItems() {
    const container = document.querySelector('.items-container');
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="物品图片">
            <p class="location-text">${item.location}</p>
            <button class="delete-button" onclick="deleteItem(${item.id})">删除</button>
        `;
        container.appendChild(itemElement);
    });
}

// 将图片转换为Base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 删除物品
function deleteItem(id) {
    if (confirm('确定要删除这个物品吗？')) {
        items = items.filter(item => item.id !== id);
        saveItems();
        displayItems();
    }
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedItems = JSON.parse(e.target.result);
                items = importedItems;
                saveItems();
                displayItems();
                alert('导入成功！');
            } catch (error) {
                alert('导入失败，请确保文件格式正确！');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.querySelector('h1').textContent}_物品列表.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function showNextLevel(parentId, currentId) {
    // 更新导航路径
    const categoryName = currentId;
    
    // 检查是否是最终项目
    let isEndItem = false;
    let parent = categories;
    let currentCategory = null;
    
    // 遍历categories找到当前项目
    for (const key in categories) {
        if (categories[key].subcategories) {
            for (const subKey in categories[key].subcategories) {
                const subCat = categories[key].subcategories[subKey];
                if (subCat.items && subCat.items.includes(currentId)) {
                    isEndItem = true;
                    break;
                }
                // 检查更深层的子类别
                if (subCat.subcategories) {
                    for (const deepKey in subCat.subcategories) {
                        const deepCat = subCat.subcategories[deepKey];
                        if (deepCat.items && deepCat.items.includes(currentId)) {
                            isEndItem = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    // 如果是最终项目，显示添加物品界面
    if (isEndItem) {
        showItemPage(currentId, parentId);
        return;
    }
    
    // 如果不是最终项目，显示子类别
    currentPath.push({
        id: currentId,
        parentId: parentId,
        name: categoryName
    });
    currentLevel++;
    
    // 获取当前类别
    if (parentId) {
        currentCategory = getCategory(currentId, parentId);
    } else {
        currentCategory = categories[currentId];
    }

    // 显示子类别或物品
    const contentDiv = document.getElementById('mainContent');
    contentDiv.innerHTML = `
        <div class="container">
            <div class="header">
                <button class="back-button" onclick="goBack()">←</button>
                <h1>${currentCategory.name}</h1>
            </div>
        <div class="category-grid">
                ${renderSubcategories(currentCategory)}
            </div>
        </div>
    `;

    // 添加点击事件
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
                showNextLevel(this.dataset.parent, this.dataset.id);
        });
    });
}

function goBack() {
    if (currentLevel <= 0) return;
    
    currentPath.pop();
    currentLevel--;
    
    if (currentLevel === 0) {
        renderMainPage();
        return;
    }
    
    const lastPath = currentPath[currentPath.length - 1];
    if (!lastPath) {
        renderMainPage();
        return;
    }
    
    const parentPath = currentPath.length > 1 ? currentPath[currentPath.length - 2] : null;
    
    if (lastPath.isItem) {
        showItemAddPage(lastPath.id, parentPath?.id);
    } else {
        showNextLevel(parentPath?.id, lastPath.id);
    }
}

function renderMainPage() {
    currentPath = [];
    currentLevel = 0;
    
    const contentDiv = document.getElementById('mainContent');
    let html = `
        <div class="category-grid">
    `;
    
    Object.keys(categories).forEach(key => {
        html += `
            <div class="category-card" data-id="${key}">
                <h2>${categories[key].name}</h2>
            </div>`;
    });
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            showNextLevel(null, this.dataset.id);
        });
    });
}

function getCategory(id, parentId = null) {
    if (!id) return categories;
    
    if (parentId) {
        const parent = getCategory(parentId);
        return parent.subcategories?.[id];
    }
    
    if (categories[id]) return categories[id];
    
    for (const key in categories) {
        const category = categories[key];
        if (category.subcategories) {
            const result = findInSubcategories(category.subcategories, id);
            if (result) return result;
        }
    }
    return null;
}

function findInSubcategories(subcategories, id) {
    if (subcategories[id]) return subcategories[id];
    
    for (const key in subcategories) {
        const category = subcategories[key];
        if (category.subcategories) {
            const result = findInSubcategories(category.subcategories, id);
            if (result) return result;
        }
    }
    return null;
}

function showItemDetail(itemName) {
    currentPath.push({ id: itemName, name: itemName });
    
    const contentDiv = document.getElementById('mainContent');
    contentDiv.innerHTML = `
        <button class="back-button" onclick="goBack()">←</button>
        <div class="item-detail">
            <div class="image-upload" onclick="handleImageUpload()">
                <span>+ 上传图片</span>
            </div>
            <input type="text" 
                   class="location-input" 
                   placeholder="存放位置（例：衣柜第三层）">
            <button class="save-btn" onclick="saveItem()">保存信息</button>
        </div>
    `;
}

function showItemAddPage(itemName, parentId) {
    if (!itemName) return;
    
    currentPath.push({ 
        id: itemName, 
        parentId: parentId,
        name: itemName,
        isItem: true 
    });
    currentLevel++;
    
    const contentDiv = document.getElementById('mainContent');
    contentDiv.innerHTML = `
        <button class="back-button">←</button>
        <div class="item-grid">
            <div class="item-card">
                <div class="image-upload">
                    <span>+</span>
                </div>
                <input type="text" class="location-input" placeholder="位置">
            </div>
        </div>
        <button class="add-item-button">添加物品</button>
    `;
    
    document.querySelector('.back-button').addEventListener('click', goBack);
    document.querySelector('.image-upload').addEventListener('click', function() {
        uploadImage(this);
    });
    document.querySelector('.add-item-button').addEventListener('click', addNewItem);
}

function showItemsGrid(items) {
    const contentDiv = document.getElementById('mainContent');
    contentDiv.innerHTML = `
        <div class="back-button" onclick="goBack()">←</div>
        <div class="item-grid">
            ${items.map(item => `
                <div class="item-card">
                    <div class="image-upload" onclick="uploadImage()">
                        <span>+</span>
                    </div>
                    <input type="text" class="location-input" placeholder="位置" value="${item}">
                </div>
            `).join('')}
            <div class="item-card">
                <div class="image-upload" onclick="uploadImage()">
                    <span>+</span>
                </div>
                <input type="text" class="location-input" placeholder="位置">
            </div>
        </div>
    `;
}

function uploadImage(element) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                element.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function renderSubcategories(category) {
    let html = '';
    
    if (category.subcategories) {
        Object.keys(category.subcategories).forEach(key => {
            const subCategory = category.subcategories[key];
            html += `
                <div class="category-card" data-parent="${category.id}" data-id="${key}">
                    <h2>${subCategory.name}</h2>
                </div>`;
        });
    } else if (category.items) {
        category.items.forEach(item => {
            html += `
                <div class="category-card" data-parent="${category.id}" data-id="${item}">
                    <h2>${item}</h2>
                </div>`;
        });
    }
    
    return html;
}

// 页面加载时显示已保存的物品
document.addEventListener('DOMContentLoaded', () => {
    displaySavedItems();
    
    // 为添加物品按钮添加点击事件
    const addButton = document.querySelector('.add-item-button');
    if (addButton) {
        addButton.addEventListener('click', addNewItem);
    }
    
    // 自动保存功能
    document.addEventListener('change', () => {
        saveAllItems();
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 滚动动画
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about, .music');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// 初始化元素样式
document.querySelectorAll('.about, .music').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// 监听滚动事件
window.addEventListener('scroll', animateOnScroll);

// 导航栏滚动效果
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});