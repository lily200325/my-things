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

function showNextLevel(parentId, currentId) {
    let currentObj;
    if (!parentId) {
        currentObj = categories[currentId];
    } else {
        let parent = categories[parentId];
        if (!parent) {
            for (const cat of Object.values(categories)) {
                if (cat.subcategories && cat.subcategories[parentId]) {
                    parent = cat.subcategories[parentId];
                    break;
                }
            }
        }
        currentObj = parent?.subcategories?.[currentId];
    }
    
    if (!currentObj) {
        console.error('找不到类别:', currentId);
        return;
    }
    
    currentPath.push({
        id: currentId,
        parentId: parentId,
        name: currentObj.name,
        type: currentObj.subcategories ? 'category' : 'items'
    });
    currentLevel++;
    
    const contentDiv = document.getElementById('mainContent');
    let html = `
        <button class="back-button">←</button>
        <div class="category-grid">
    `;

    if (currentObj.subcategories) {
        Object.keys(currentObj.subcategories).forEach(key => {
            const subCategory = currentObj.subcategories[key];
            html += `
                <div class="category-card" data-parent="${currentId}" data-id="${key}">
                    <h2>${subCategory.name}</h2>
                </div>`;
        });
    } else if (currentObj.items) {
        currentObj.items.forEach(item => {
            html += `
                <div class="category-card" data-parent="${currentId}" data-item="${item}">
                    <h2>${item}</h2>
                </div>`;
        });
    }

    html += '</div>';
    contentDiv.innerHTML = html;

    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', goBack);

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const itemName = this.dataset.item;
            if (itemName) {
                showItemAddPage(itemName, this.dataset.parent);
            } else {
                showNextLevel(this.dataset.parent, this.dataset.id);
            }
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

function addNewItem() {
    const itemGrid = document.querySelector('.item-grid');
    const newItem = document.createElement('div');
    newItem.className = 'item-card';
    newItem.innerHTML = `
        <div class="image-upload">
            <span>+</span>
        </div>
        <input type="text" class="location-input" placeholder="位置">
    `;
    
    newItem.querySelector('.image-upload').addEventListener('click', function() {
        uploadImage(this);
    });
    
    itemGrid.appendChild(newItem);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                savedItems = JSON.parse(e.target.result);
                localStorage.setItem('myThings', JSON.stringify(savedItems));
                alert('数据导入成功！');
            } catch (error) {
                alert('数据导入失败，请确保文件格式正确！');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportData() {
    const data = JSON.stringify(savedItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_things_backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

function saveItem(button) {
    const itemCard = button.parentElement;
    const location = itemCard.querySelector('.location-input').value;
    const image = itemCard.querySelector('.image-upload img')?.src;
    
    if (!location) {
        alert('请输入存放位置');
        return;
    }
    
    const currentCategory = currentPath[currentPath.length - 1].name;
    if (!savedItems[currentCategory]) {
        savedItems[currentCategory] = [];
    }
    
    savedItems[currentCategory].push({
        location: location,
        image: image,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('myThings', JSON.stringify(savedItems));
    alert('保存成功！');
    
    itemCard.querySelector('.image-upload').innerHTML = '<span>+</span>';
    itemCard.querySelector('.location-input').value = '';
}

function loadSavedItems() {
    const saved = localStorage.getItem('myThings');
    if (saved) {
        savedItems = JSON.parse(saved);
    }
}