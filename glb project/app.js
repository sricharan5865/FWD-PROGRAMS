/**
 * Virtual Sharing App
 * Pure Vanilla JS Implementation - No Tailwind CSS
 */

// CO3: JavaScript Programming Essentials - Objects & Arrays, Classes
class App {
    constructor() {
        this.state = {
            view: 'Home',
            userRole: 'Student',
            // CO4: Browser storage & Async Programming - Local Storage
            rollNumber: localStorage.getItem('uniboost_roll_number') || null,
            browseFilter: 'All',
            lostFilter: 'All',
            adminTab: 'FileReview', // For admin dashboard navigation

            files: this.loadData('files') || [],

            users: this.loadData('users') || [],

            subjects: ['FWD', 'MAI', 'DSA', 'CSE (English)', 'Coding'],

            lostItems: this.loadData('lostItems') || [],

            latestNews: 'Mid-term exams are scheduled for next week. Best of luck to all students!',

            queries: this.loadData('queries') || []
        };

        this.init();
    }

    init() {
        if (!this.state.rollNumber) {
            this.showLoginScreen();
        } else {
            this.render();
        }
    }

    // CO4: Storage & Async Programming - Browser storage
    loadData(key) {
        const data = localStorage.getItem(`uniboost_${key}`);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(`uniboost_${key}`, JSON.stringify(data));
    }

    navigate(view) {
        this.state.view = view;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.render();
    }

    login(rollNumber) {
        this.state.rollNumber = rollNumber;
        this.state.userRole = rollNumber.toUpperCase().includes('ADMIN') ? 'Admin' : 'Student';
        localStorage.setItem('uniboost_roll_number', rollNumber);
        if (!this.state.users.includes(rollNumber)) {
            this.state.users.push(rollNumber);
            this.saveData('users', this.state.users);
        }
        this.render();
    }

    logout() {
        localStorage.removeItem('uniboost_roll_number');
        this.state.rollNumber = null;
        this.state.userRole = 'Student';
        this.state.view = 'Home';
        this.init();
    }

    // ── Actions ──────────────────────────────────────────────

    uploadFile(fileData) {
        const newFile = {
            id: 'f' + Date.now(),
            ...fileData,
            downloadCount: 0,
            status: 'Pending',
            uploadedAt: new Date().toISOString()
        };
        this.state.files.unshift(newFile);
        this.saveData('files', this.state.files);
        this.showToast('File deployed! Pending admin verification (2-4 hours).');
        this.navigate('Browse');
    }

    reportLostItem(itemData) {
        const newItem = {
            id: 'l' + Date.now(),
            ...itemData,
            dateReported: new Date().toISOString().split('T')[0]
        };
        this.state.lostItems.unshift(newItem);
        this.saveData('lostItems', this.state.lostItems);
        this.showToast('Item reported successfully!');
        this.navigate('LostItems');
    }

    deleteFile(id) {
        // CO3: Functions, arrow functions, basic expressions
        if (this.state.userRole !== 'Admin') return this.showToast('Permission denied.', true);
        if (!confirm('Delete this file permanently?')) return;
        this.state.files = this.state.files.filter(f => f.id !== id);
        this.saveData('files', this.state.files);
        this.render();
    }

    approveFile(id) {
        if (this.state.userRole !== 'Admin') return this.showToast('Permission denied.', true);
        const file = this.state.files.find(f => f.id === id); // CO3: Array methods
        if (file) {
            file.status = 'Approved';
            this.saveData('files', this.state.files);
            this.showToast(`"${file.title}" approved!`);
            this.render();
        }
    }

    addQuery(question) {
        if (!question.trim()) return;
        const newQuery = {
            id: 'q' + Date.now(),
            author: this.state.rollNumber,
            question: question.trim(),
            timestamp: new Date().toISOString().split('T')[0],
            replies: []
        };
        this.state.queries.unshift(newQuery);
        this.saveData('queries', this.state.queries);
        this.showToast('Query posted!');
        this.render();
    }

    addReply(queryId, text) {
        if (!text.trim()) return;
        const query = this.state.queries.find(q => q.id === queryId);
        if (query) {
            query.replies.push({
                author: this.state.rollNumber,
                text: text.trim(),
                timestamp: new Date().toISOString().split('T')[0]
            });
            this.saveData('queries', this.state.queries);
            this.render();
        }
    }

    downloadFile(id) {
        const file = this.state.files.find(f => f.id === id);
        if (!file) return;
        if (file.fileData) {
            const link = document.createElement('a');
            link.href = file.fileData;
            link.download = file.fileName || `${file.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            this.showToast(`Downloading "${file.title}"... (mock file)`);
        }
        file.downloadCount++;
        this.saveData('files', this.state.files);
        this.render();
    }

    showToast(msg, isError = false) {
        const existing = document.getElementById('vs-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.id = 'vs-toast';
        toast.style.cssText = `
            position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px);
            background:${isError ? 'rgba(239,68,68,0.15)' : 'rgba(15,23,42,0.95)'};
            border:1px solid ${isError ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.12)'};
            color:${isError ? '#f87171' : '#f1f5f9'};
            padding:12px 24px; border-radius:12px; font-size:14px; font-family:Inter,sans-serif;
            backdrop-filter:blur(16px); z-index:9999; white-space:nowrap;
            box-shadow:0 10px 30px rgba(0,0,0,0.4);
            animation: toastIn 0.3s ease forwards;
        `;
        toast.textContent = msg;
        const style = document.createElement('style');
        style.textContent = `@keyframes toastIn { to { transform: translateX(-50%) translateY(0); opacity:1; } from { transform: translateX(-50%) translateY(20px); opacity:0; } }`;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // ── Render Core ───────────────────────────────────────────

    render() {
        const root = document.getElementById('app-root');
        const navLinks = document.getElementById('nav-links');
        const userInfo = document.getElementById('user-info');

        const links = [
            { name: 'Home', icon: '🏠', view: 'Home' },
            { name: 'Browse Materials', icon: '🔍', view: 'Browse' },
            { name: 'Upload', icon: '📤', view: 'Upload' },
            { name: 'Lost Items', icon: '🔎', view: 'LostItems' },
            { name: 'Dashboard', icon: '📊', view: 'Dashboard' }
        ];

        navLinks.innerHTML = links.map(link => {
            const isActive = this.state.view === link.view;
            return `
                <button onclick="window.app.navigate('${link.view}')"
                    class="nav-link ${isActive ? 'active' : ''}">
                    <span>${link.icon}</span>${link.name}
                </button>
            `;
        }).join('');

        userInfo.innerHTML = `
            <span>Hello,</span>
            <span class="user-name">${this.state.rollNumber}</span>
            <span class="user-badge ${this.state.userRole === 'Admin' ? 'admin' : ''}">${this.state.userRole}</span>
        `;

        root.className = 'app-root fade-in';
        switch (this.state.view) {
            case 'Home': root.innerHTML = this.renderHome(); break;
            case 'Browse': root.innerHTML = this.renderBrowse(); break;
            case 'Upload': root.innerHTML = this.renderUpload(); break;
            case 'LostItems': root.innerHTML = this.renderLostItems(); break;
            case 'Dashboard': root.innerHTML = this.renderDashboard(); break;
            default: root.innerHTML = this.renderHome();
        }

        this.bindPostRenderEvents();
    }

    bindPostRenderEvents() {
        // Search bar in browse
        const searchInput = document.getElementById('browse-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.state.searchQuery = searchInput.value;
                this.updateFileGrid();
            });
        }
    }

    updateFileGrid() {
        const grid = document.getElementById('files-grid');
        if (!grid) return;
        grid.innerHTML = this.renderFileCards();
    }

    // ── View: Home ────────────────────────────────────────────

    renderHome() {
        return `
            <div>
                <!-- Hero -->
                <section class="hero">
                    <div class="hero-glow"></div>
                    <span class="hero-badge">🚀 V2.0 is now live</span>
                    <h1 class="hero-title">
                        <span class="hero-title-line1">Share, Discover &</span>
                        <span class="hero-title-line2">Learn Smarter</span>
                    </h1>
                    <p class="hero-desc">
                        A centralized platform where students upload and access study materials,
                        managed securely by an admin. Your academic success starts here.
                    </p>
                    <div class="hero-actions">
                        <button class="btn-primary" onclick="window.app.navigate('Browse')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Browse Materials
                        </button>
                        <button class="btn-secondary" onclick="window.app.navigate('Upload')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload Files
                        </button>
                    </div>
                </section>

                <!-- Announcement -->
                <div class="announcement">
                    <div class="announcement-glow"></div>
                    <div class="announcement-inner">
                        <div class="announcement-icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <p class="announcement-title">Latest Announcement</p>
                            <p class="announcement-text">${this.state.latestNews}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ── View: Browse ──────────────────────────────────────────

    getFilteredFiles() {
        let files = this.state.files.filter(f => f.status === 'Approved');
        if (this.state.browseFilter && this.state.browseFilter !== 'All') {
            files = files.filter(f => f.subject === this.state.browseFilter);
        }
        if (this.state.searchQuery) {
            const q = this.state.searchQuery.toLowerCase();
            files = files.filter(f =>
                f.title.toLowerCase().includes(q) ||
                f.subject.toLowerCase().includes(q) ||
                f.id.toLowerCase().includes(q)
            );
        }
        return files;
    }

    renderFileCards() {
        const files = this.getFilteredFiles();
        if (files.length === 0) {
            return `<div class="empty-state"><div class="empty-state-emoji">📂</div><p>No assets found matching your criteria.</p></div>`;
        }
        return files.map(file => {
            const typeClass = file.type ? file.type.toLowerCase() : 'pdf';
            return `
                <div class="file-card">
                    <div class="file-card-top">
                        <span class="file-type-badge ${typeClass}">${file.type || 'PDF'}</span>
                        ${this.state.userRole === 'Admin' ? `
                            <button class="btn-delete-icon" onclick="window.app.deleteFile('${file.id}')" title="Delete file">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        ` : ''}
                    </div>
                    <p class="file-card-title">${file.title}</p>
                    <div class="file-tags">
                        <span class="tag">${file.subject}</span>
                        <span class="tag">${file.id.toUpperCase()}</span>
                        <span class="tag">${file.type || 'PDF'}</span>
                        <span class="tag">${file.size || 'Unknown'}</span>
                    </div>
                    <div class="file-card-footer">
                        <div class="file-uploader">by <span>${file.uploader}</span></div>
                        <button class="btn-download" onclick="window.app.downloadFile('${file.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download (${file.downloadCount})
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderBrowse() {
        const approvedCount = this.state.files.filter(f => f.status === 'Approved').length;
        const cats = ['All', ...this.state.subjects];

        return `
            <div>
                <div class="repo-header">
                    <h2 class="repo-title">Academic Repository</h2>
                    <span class="repo-count">${approvedCount} indexed assets</span>
                </div>

                <div class="browse-controls">
                    <div class="filter-tabs">
                        ${cats.map(cat => `
                            <button class="filter-btn ${this.state.browseFilter === cat ? 'active' : ''}"
                                onclick="window.app.setFilter('${cat}')">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                    <div class="search-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            id="browse-search"
                            class="search-input"
                            placeholder="Search assets by title, subject, or ID..."
                            value="${this.state.searchQuery || ''}"
                        >
                    </div>
                </div>

                <div class="files-grid" id="files-grid">
                    ${this.renderFileCards()}
                </div>
            </div>
        `;
    }

    setFilter(cat) {
        this.state.browseFilter = cat;
        this.render();
    }

    // ── View: Upload ──────────────────────────────────────────

    renderUpload() {
        return `
            <div class="upload-wrap">
                <!-- Main Form -->
                <div class="upload-form-card">
                    <div class="upload-form-header">
                        <div class="upload-icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </div>
                        <h2>Asset Title</h2>
                        <p>Deploy your materials to the network for verification.</p>
                    </div>

                    <form onsubmit="event.preventDefault(); window.app.handleUpload(this);">
                        <div class="form-group">
                            <label class="form-label">Asset Title</label>
                            <input type="text" name="title" required class="form-input" placeholder="e.g. DSA Unit 3 Notes">
                        </div>

                        <div class="form-grid-2">
                            <div class="form-group">
                                <label class="form-label">Academic Category</label>
                                <select name="subject" class="form-select">
                                    ${this.state.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">File Type</label>
                                <select name="type" class="form-select">
                                    <option value="PDF">PDF</option>
                                    <option value="DOC">Word Document</option>
                                    <option value="PPT">PowerPoint</option>
                                    <option value="ZIP">Zip Archive</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-textarea" placeholder="Brief description of the material..."></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Select File</label>
                            <input type="file" name="file" required class="form-file-input">
                        </div>

                        <button type="submit" class="btn-submit">
                            🚀 Deploy to Network
                        </button>
                    </form>
                </div>

                <!-- Sidebar -->
                <div class="upload-sidebar">
                    <div class="sidebar-card">
                        <p class="sidebar-card-title">Network Status</p>
                        <div class="sidebar-status">
                            <span class="status-dot"></span>
                            Node Secure
                        </div>
                    </div>
                    <div class="sidebar-card">
                        <p class="sidebar-card-title">Verification</p>
                        <p class="sidebar-info-text">
                            Uploaded assets are manually reviewed by the admin before being published to the network. This typically takes 2–4 hours.
                        </p>
                    </div>
                    <div class="sidebar-card">
                        <p class="sidebar-card-title">Accepted Formats</p>
                        <p class="sidebar-info-text">PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR</p>
                    </div>
                </div>
            </div>
        `;
    }

    handleUpload(form) {
        const formData = new FormData(form);
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = {
                    title: formData.get('title'),
                    subject: formData.get('subject'),
                    type: formData.get('type'),
                    description: formData.get('description'),
                    uploader: this.state.rollNumber,
                    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                    fileName: file.name,
                    fileData: e.target.result
                };
                this.uploadFile(data);
            };
            reader.readAsDataURL(file);
        } else {
            const data = {
                title: formData.get('title'),
                subject: formData.get('subject'),
                type: formData.get('type'),
                description: formData.get('description'),
                uploader: this.state.rollNumber,
                size: '0 MB',
                fileName: 'unknown'
            };
            this.uploadFile(data);
        }
    }

    // ── View: Lost Items ──────────────────────────────────────

    getFilteredLostItems() {
        if (this.state.lostFilter === 'All') return this.state.lostItems;
        return this.state.lostItems.filter(i => i.status === this.state.lostFilter);
    }

    renderLostItems() {
        const filters = ['All', 'Lost', 'Found'];
        const items = this.getFilteredLostItems();

        return `
            <div>
                <div class="lost-found-header">
                    <div class="section-header-left">
                        <h2>🔎 Lost &amp; Found</h2>
                        <p>Report or find lost items within the campus.</p>
                    </div>
                    <button class="btn-report" onclick="document.getElementById('report-modal').classList.remove('hidden')">
                        + Report Item
                    </button>
                </div>

                <div class="lost-filters">
                    ${filters.map(f => `
                        <button class="status-filter-btn ${this.state.lostFilter === f ? 'active' : ''}"
                            onclick="window.app.setLostFilter('${f}')">
                            ${f}
                        </button>
                    `).join('')}
                </div>

                <div class="lost-items-grid">
                    ${items.length === 0 ? `
                        <div class="empty-state" style="grid-column:1/-1">
                            <div class="empty-state-emoji">📦</div>
                            <p>No items found.</p>
                        </div>
                    ` : items.map(item => `
                        <div class="lost-item-card">
                            <div>
                                <div class="lost-item-badges">
                                    <span class="status-badge ${item.status.toLowerCase()}">${item.status}</span>
                                    <span class="lost-item-date">${item.dateReported}</span>
                                </div>
                                <p class="lost-item-name">${item.itemName}</p>
                                <div class="lost-item-location">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    ${item.location}
                                </div>
                            </div>
                            <button class="btn-contact">Contact</button>
                        </div>
                    `).join('')}
                </div>

                <!-- Report Modal -->
                <div id="report-modal" class="modal-overlay hidden">
                    <div class="modal-box">
                        <button class="modal-close" onclick="document.getElementById('report-modal').classList.add('hidden')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <h3 class="modal-title">Report an Item</h3>
                        <form onsubmit="event.preventDefault(); window.app.handleReport(this);">
                            <div class="form-group">
                                <input type="text" name="itemName" placeholder="Item Name (e.g. Blue Hoodie)" required class="form-input">
                            </div>
                            <div class="form-group">
                                <input type="text" name="location" placeholder="Last seen location" required class="form-input">
                            </div>
                            <div class="form-group">
                                <select name="status" class="form-select">
                                    <option value="Lost">I Lost this</option>
                                    <option value="Found">I Found this</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-submit">Submit Report</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    setLostFilter(filter) {
        this.state.lostFilter = filter;
        this.render();
    }

    handleReport(form) {
        const formData = new FormData(form);
        const data = {
            itemName: formData.get('itemName'),
            location: formData.get('location'),
            status: formData.get('status'),
        };
        this.reportLostItem(data);
        const modal = document.getElementById('report-modal');
        if (modal) modal.classList.add('hidden');
    }

    // ── View: Dashboard ───────────────────────────────────────

    setAdminTab(tab) {
        this.state.adminTab = tab;
        this.render();
    }

    renderDashboard() {
        const totalUsers = this.state.users.length;
        const totalFiles = this.state.files.length;
        const totalDownloads = this.state.files.reduce((sum, f) => sum + (f.downloadCount || 0), 0);
        const pendingFiles = this.state.files.filter(f => f.status === 'Pending');
        const openQueries = this.state.queries.length;

        if (this.state.userRole === 'Admin') {
            return this.renderAdminDashboard(totalFiles, pendingFiles);
        }

        return `
            <div>
                <!-- Dashboard Header -->
                <div class="dashboard-header">
                    <div class="dashboard-header-top">
                        <h2>
                            ${this.state.userRole === 'Admin'
                ? `Welcome back, <span style="background:linear-gradient(90deg,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${this.state.rollNumber}</span>`
                : `Welcome back, <span style="color:#818cf8">${this.state.rollNumber}</span>`
            }
                        </h2>
                        ${this.state.userRole === 'Admin' ? '<span class="admin-super-badge">Super Admin</span>' : ''}
                    </div>
                    <p class="dashboard-welcome">
                        ${this.state.userRole === 'Admin'
                ? `Global Indexing: <span>${totalFiles} Curated Files</span> &nbsp;•&nbsp; <span>${openQueries} Open Queries</span>`
                : `Here is your community activity overview.`
            }
                    </p>
                </div>

                        <!-- Community Queries -->
                        <div>
                            <h3 class="section-card-title" style="margin-bottom:16px; color:#f1f5f9">Community Queries</h3>

                            <div class="query-form-card">
                                <form class="query-form" onsubmit="event.preventDefault(); window.app.addQuery(this.question.value); this.reset();">
                                    <input type="text" name="question" required placeholder="Ask a question to the community..." class="query-input">
                                    <button type="submit" class="btn-post">Post</button>
                                </form>
                            </div>

                            <div class="query-list">
                                ${this.state.queries.length === 0
                ? '<div class="no-results">No queries yet. Be the first to ask!</div>'
                : this.state.queries.map(q => `
                                        <div class="query-card">
                                            <p class="query-question">${q.question}</p>
                                            <p class="query-meta">
                                                Asked by <span class="query-author">${q.author}</span> · ${q.timestamp}
                                            </p>
                                            ${q.replies.length > 0 ? `
                                                <div class="replies-list">
                                                    ${q.replies.map(r => `
                                                        <div class="reply-bubble">
                                                            <p class="reply-text">${r.text}</p>
                                                            <div class="reply-meta">
                                                                <span>Reply by <span class="reply-author">${r.author}</span></span>
                                                                <span>${r.timestamp}</span>
                                                            </div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                            <form class="reply-form" onsubmit="event.preventDefault(); window.app.addReply('${q.id}', this.reply.value); this.reset();">
                                                <input type="text" name="reply" required placeholder="Write a reply..." class="reply-input">
                                                <button type="submit" class="btn-reply">Reply</button>
                                            </form>
                                        </div>
                                    `).join('')
            }
                            </div>
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="dashboard-sidebar">
                        <div class="profile-card">
                            <p class="profile-card-label">Your Profile</p>
                            <div class="profile-row">
                                <span class="profile-row-label">Roll Number</span>
                                <span class="profile-row-value">${this.state.rollNumber}</span>
                            </div>
                            <div class="profile-row">
                                <span class="profile-row-label">Role</span>
                                <span class="profile-row-value indigo">${this.state.userRole}</span>
                            </div>
                            <div class="profile-row">
                                <span class="profile-row-label">Files</span>
                                <span class="profile-row-value">${this.state.files.filter(f => f.uploader === this.state.rollNumber).length}</span>
                            </div>
                        </div>

                        <div class="profile-card">
                            <p class="profile-card-label">Quick Actions</p>
                            <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
                                <button onclick="window.app.navigate('Browse')" class="btn-secondary" style="width:100%;justify-content:center;font-size:13px;padding:10px">Access Repository</button>
                                <button onclick="window.app.navigate('Upload')" class="btn-secondary" style="width:100%;justify-content:center;font-size:13px;padding:10px">Upload Asset</button>
                            </div>
                        </div>

                        <div class="admin-access-card" onclick="window.app.claimAdminAccess()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <span>Admin Access</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdminDashboard(totalFiles, pendingFiles) {
        const approvedFiles = this.state.files.filter(f => f.status === 'Approved');

        return `
            <div class="admin-dashboard-container">
                <!-- Top Header banner -->
                <div class="admin-top-banner">
                    <button class="btn-factory-reset" onclick="if(confirm('☢️ ARE YOU SURE YOU WANT TO RESET ALL SYSTEM DATA? THIS CANNOT BE UNDONE.')){localStorage.clear();window.location.reload();}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        ☢️ FACTORY RESET
                    </button>
                </div>

                <div class="admin-stats-row">
                    <div class="admin-stat-card outline-blue">
                        <div class="stat-header">
                            <span class="pulse-dot blue"></span> STRICT MODERATION
                        </div>
                        <div class="stat-action-btn">CHANGE</div>
                    </div>
                    <div class="admin-stat-card outline-green">
                        <div class="stat-header">
                            <span class="pulse-dot green"></span> NODES ACTIVE
                        </div>
                        <div class="stat-value-large text-green">8</div>
                    </div>
                    <div class="admin-stat-card outline-purple">
                        <div class="stat-header">
                            <span class="pulse-dot purple"></span> ITEMS INDEXED
                        </div>
                        <div class="stat-value-large text-purple">${approvedFiles.length}</div>
                    </div>
                    <div class="admin-stat-card outline-orange">
                        <div class="stat-header">
                            <span class="pulse-dot orange"></span> FILE REVIEW
                        </div>
                        <div class="stat-value-large text-orange">${pendingFiles.length}</div>
                    </div>
                    <div class="admin-stat-card outline-red">
                        <div class="stat-header">
                            <span class="pulse-dot red"></span> MENTOR OPS
                        </div>
                        <div class="stat-value-large text-red">0</div>
                    </div>
                </div>

                <div class="admin-tabs-nav">
                    <button class="admin-tab-btn ${this.state.adminTab === 'FileReview' ? 'active' : ''}" onclick="window.app.setAdminTab('FileReview')">File Review</button>
                    <button class="admin-tab-btn ${this.state.adminTab === 'MentorOps' ? 'active' : ''}" onclick="window.app.setAdminTab('MentorOps')">Mentor Ops</button>
                    <button class="admin-tab-btn ${this.state.adminTab === 'Subjects' ? 'active' : ''}" onclick="window.app.setAdminTab('Subjects')">Subjects</button>
                    <button class="admin-tab-btn ${this.state.adminTab === 'AssetMap' ? 'active' : ''}" onclick="window.app.setAdminTab('AssetMap')">Asset Map</button>
                    <button class="admin-tab-btn ${this.state.adminTab === 'SystemLogs' ? 'active' : ''}" onclick="window.app.setAdminTab('SystemLogs')">System Logs</button>
                </div>

                <div class="admin-tab-content">
                    ${this.renderAdminTabContent(pendingFiles, approvedFiles)}
                </div>
                
                <!-- Live Updates Bottom Panel -->
                <div class="admin-live-updates-panel">
                    <h3 class="panel-title">LIVE UPDATES</h3>
                    <div class="live-update-control">
                        <textarea id="live-update-textarea" placeholder="Broadcast message to all active nodes...">${this.state.latestNews}</textarea>
                        <button class="btn-post-update" onclick="window.app.postLiveUpdate()">POST UPDATE</button>
                    </div>
                </div>
            </div>
        `;
    }

    postLiveUpdate() {
        const text = document.getElementById('live-update-textarea').value.trim();
        if (text) {
            this.state.latestNews = text;
            this.showToast('Live update broadcasted to all nodes!');
            this.render();
        }
    }

    renderAdminTabContent(pendingFiles, approvedFiles) {
        switch (this.state.adminTab) {
            case 'FileReview':
                return this.renderReviewBuffer(pendingFiles);
            case 'AssetMap':
                return this.renderAssetMap(approvedFiles);
            case 'Subjects':
                return this.renderSubjectsTab();
            case 'SystemLogs':
                return this.renderSystemLogs();
            case 'MentorOps':
                return '<div class="admin-empty-state">No mentor operations currently active.</div>';
            default:
                return this.renderReviewBuffer(pendingFiles);
        }
    }

    renderReviewBuffer(pendingFiles) {
        if (pendingFiles.length === 0) {
            return `
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ASSET SIGNATURE</th>
                                <th>ORIGIN USER</th>
                                <th class="right">PROTOCOL ACTION</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="admin-empty-state">REVIEW BUFFER EMPTY</div>
                </div>
            `;
        }

        return `
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ASSET SIGNATURE</th>
                            <th>ORIGIN USER</th>
                            <th class="right">PROTOCOL ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingFiles.map(f => `
                            <tr>
                                <td>
                                    <div class="asset-signature-cell">
                                        <span class="file-type-icon">${f.type || 'TXT'}</span>
                                        ${f.title}
                                    </div>
                                </td>
                                <td><span class="origin-user-badge">${f.uploader}</span></td>
                                <td class="right">
                                    <div class="protocol-action-buttons">
                                        <button class="btn-approve-asset" onclick="window.app.approveFile('${f.id}')">APPROVE</button>
                                        <button class="btn-reject-asset" onclick="window.app.deleteFile('${f.id}')">REJECT</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderAssetMap(approvedFiles) {
        return `
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>LIVE ASSET</th>
                            <th>PUBLISHER</th>
                            <th class="right">GOVERNANCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${approvedFiles.map(f => `
                            <tr>
                                <td>
                                    <div class="live-asset-cell">
                                        <span class="status-live-dot"></span>
                                        <div>
                                            <div class="live-asset-title">${f.title}</div>
                                            <div class="live-asset-meta">${f.subject}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span class="origin-user-badge">${f.uploader}</span></td>
                                <td class="right">
                                    <div class="governance-actions">
                                        <span class="download-stats">${f.downloadCount} DLs</span>
                                        <button class="btn-revoke-asset" onclick="window.app.deleteFile('${f.id}')">REVOKE ASSET</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderSubjectsTab() {
        return `
            <div class="admin-subjects-container">
                <div class="admin-subject-header">
                    <input type="text" id="new-subject-input" class="admin-input-dark" placeholder="Declare new academic category...">
                    <button class="btn-commit-subject" onclick="window.app.addSubject()">COMMIT SUBJECT</button>
                </div>
                <div class="admin-subjects-grid">
                    ${this.state.subjects.map(subject => `
                        <div class="admin-subject-card">
                            <span class="subject-name">${subject}</span>
                            <button class="btn-delete-icon" onclick="window.app.deleteSubject('${subject}')" title="Delete subject">
                                🗑️
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    addSubject() {
        const input = document.getElementById('new-subject-input');
        const newSubject = input.value.trim();
        if (newSubject && !this.state.subjects.includes(newSubject)) {
            this.state.subjects.push(newSubject);
            this.saveData('subjects', this.state.subjects); // need to ensure subjects are saved/loaded properly
            this.showToast(`Category '${newSubject}' committed to system.`);
            this.render();
        }
    }

    deleteSubject(subject) {
        if (confirm(`Delete '${subject}'? This will not delete files but removes the category.`)) {
            this.state.subjects = this.state.subjects.filter(s => s !== subject);
            this.showToast(`Category '${subject}' removed.`);
            this.render();
        }
    }

    renderSystemLogs() {
        // Generate mock log history. In a real app this would come from a backend.
        const mockLogs = [
            `[System] Server initialized at ${new Date().toLocaleTimeString()} `,
            "[Auth] Administrator session established via SECURE_PORTAL",
            "[Network] Connection alive - Latency: 24ms",
            "[DB] Asset indexing verified - Status: OK",
            "[Storage] Volume mount points successfully localized",
            "[Security] Incoming traffic monitoring active"
        ];

        return `
            <div class="admin-terminal">
                <div class="terminal-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>> process_runtime.log</span>
                    <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; background: rgba(255,255,255,0.1);" onclick="window.app.exportSystemLogs()">Export CSV</button>
                </div>
                <div class="terminal-body">
                    ${mockLogs.map(log => `<div class="terminal-line"><span class="terminal-time">${new Date().toLocaleTimeString()}</span> ${log}</div>`).join('')}
                    <div class="terminal-line"><span class="terminal-cursor">█</span></div>
                </div>
            </div>
        `;
    }

    exportSystemLogs() {
        const mockLogData = "Timestamp,Level,Message\n" +
            `${new Date().toISOString()}, INFO, Server initialized\n` +
            `${new Date().toISOString()}, INFO, Administrator session established via SECURE_PORTAL\n` +
            `${new Date().toISOString()}, INFO, Network connection alive - Latency: 24ms\n` +
            `${new Date().toISOString()}, INFO, Asset indexing verified - Status: OK\n` +
            `${new Date().toISOString()}, WARN, High CPU utilization detected during indexing\n` +
            `${new Date().toISOString()}, INFO, Security monitoring active`;

        const blob = new Blob([mockLogData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.hidden = true;
        a.href = url;
        a.download = `system_logs_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.showToast('System logs exported successfully.');
    }

    // ── Admin Access ──────────────────────────────────────────

    claimAdminAccess() {
        const modal = document.createElement('div');
        modal.id = 'admin-access-modal';
        modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px); z-index: 500;
        display: flex; align-items: center; justify-content: center; padding: 20px;
        `;
        modal.innerHTML = `
            <div style="background:#0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; width: 100%; max-width: 360px; padding: 32px; text-align: center; animation:fadeIn .25s ease;">
                <div style="width: 44px; height: 44px; background: linear-gradient(135deg,#4f46e5,#7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; box-shadow: 0 6px 20px rgba(99, 102, 241, .4);">
                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect><path d='M7 11V7a5 5 0 0 1 10 0v4'></path></svg>
                </div>
                <h3 style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;">Admin Access</h3>
                <p style="font-size:13px;color:#94a3b8;margin-bottom:24px;">Enter the admin password to continue.</p>
                <input
                    id="admin-pwd-input"
                    type="password"
                    placeholder="Enter password"
                    style="
                        width:100%;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);
                        border-radius:10px;padding:12px 16px;text-align:center;
                        font-size:15px;color:#fff;outline:none;letter-spacing:.15em;
                        font-family:Inter,sans-serif;margin-bottom:14px;
                        transition:border-color .2s;
                    "
                    onkeydown="if(event.key==='Enter')window.app.verifyAdminPassword()"
                    onfocus="this.style.borderColor='rgba(99,102,241,.6)'"
                    onblur="this.style.borderColor='rgba(255,255,255,.1)'"
                >
                <button onclick="window.app.verifyAdminPassword()" style="
                    width:100%;padding:12px;background:#4f46e5;color:#fff;
                    font-weight:700;font-size:14px;border:none;border-radius:10px;
                    cursor:pointer;font-family:Inter,sans-serif;
                    box-shadow:0 4px 15px rgba(79,70,229,.4);
                    transition:all .2s;
                " onmouseover="this.style.background='#6366f1'" onmouseout="this.style.background='#4f46e5'">
                    Verify &amp; Unlock
                </button>
                <button onclick="document.getElementById('admin-access-modal').remove()" style="
                    margin-top:10px;width:100%;padding:10px;background:transparent;
                    color:#64748b;border:none;font-size:13px;cursor:pointer;
                    font-family:Inter,sans-serif;
                ">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => {
            const input = document.getElementById('admin-pwd-input');
            if (input) input.focus();
        }, 100);
    }

    verifyAdminPassword() {
        const input = document.getElementById('admin-pwd-input');
        if (!input) return;
        const entered = input.value.trim();
        if (entered === '586522') {
            document.getElementById('admin-access-modal').remove();
            this.state.userRole = 'Admin';
            this.showToast('🔓 Admin access granted!');
            this.render();
        } else {
            input.style.borderColor = 'rgba(239,68,68,.6)';
            input.value = '';
            input.placeholder = 'Incorrect password. Try again.';
            setTimeout(() => {
                input.style.borderColor = 'rgba(255,255,255,.1)';
                input.placeholder = 'Enter password';
            }, 2000);
        }
    }

    // ── Login Screen ──────────────────────────────────────────

    showLoginScreen() {
        const root = document.querySelector('body');
        const overlay = document.createElement('div');
        overlay.id = 'login-overlay';
        overlay.className = 'login-overlay';
        overlay.innerHTML = `
            <div class="login-box">
                <div class="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                </div>
                <h1 class="login-title">System Access</h1>
                <p class="login-subtitle">UNIVERSITY CREDENTIAL<br>Enter your roll number to access the portal.</p>

                <form onsubmit="event.preventDefault(); window.app.handleLogin(this.roll.value, document.getElementById('login-overlay'));">
                    <input
                        type="text"
                        name="roll"
                        required
                        placeholder="Enter Roll Number (e.g. 2520090137)"
                        class="login-input"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button type="submit" class="login-btn">Connect Gateway →</button>
                </form>

                <p class="login-hint">
                    Format: Must start with 25200 followed by 5 digits (Total 10).<br>
                    Tip: Use any roll number containing 'ADMIN' to get admin access.
                </p>
            </div>
            `;
        root.appendChild(overlay);
    }
    // CO5: Forms & API Integration - Form validation with JavaScript, Handling user input
    handleLogin(rollNumber, overlay) {
        const isAdmin = rollNumber.toUpperCase().includes('ADMIN');
        const studentRegex = /^25200\d{5}$/;

        if (!isAdmin && !studentRegex.test(rollNumber)) {
            // CO5: Form validation error handling
            this.showToast('Invalid Roll Number! Must start with "25200" and have 10 digits.', true);
            return;
        }

        this.login(rollNumber);
        if (overlay) overlay.remove(); // CO4: DOM Manipulation
    }
}

// CO4: DOM & Events - Event handling
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
