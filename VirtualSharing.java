import java.util.*;

// ============================================================
//  Virtual Sharing - Console App (DSA-backed implementation)
//  Features: Login, Material Repository, Upload, Search,
//            Filter, Lost & Found, Dashboard
// ============================================================
public class VirtualSharing {

    // ==================== DSA STRUCTURES ====================

    // --- Trie Node for prefix-based search ---
    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        List<Integer> materialIds = new ArrayList<>(); // asset IDs that pass through this node
        boolean isEnd = false;
    }

    static class Trie {
        TrieNode root = new TrieNode();

        void insert(String word, int id) {
            TrieNode node = root;
            for (char c : word.toLowerCase().toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
                node.materialIds.add(id);
            }
            node.isEnd = true;
        }

        List<Integer> search(String prefix) {
            TrieNode node = root;
            for (char c : prefix.toLowerCase().toCharArray()) {
                if (!node.children.containsKey(c)) return new ArrayList<>();
                node = node.children.get(c);
            }
            return new ArrayList<>(new LinkedHashSet<>(node.materialIds));
        }
    }

    // ==================== DATA MODELS ====================

    static class Student {
        String rollNumber;
        String name;
        int uploadCount;
        int queryCount;

        Student(String rollNumber, String name) {
            this.rollNumber = rollNumber;
            this.name = name;
            this.uploadCount = 0;
            this.queryCount = 0;
        }
    }

    static class Material {
        static int counter = 1;
        int id;
        String title;
        String subject;   // FWD | MAI | DSA | CSE | CODING
        String description;
        String fileType;  // PDF | DOC | ZIP
        int fileSizeKB;
        String uploaderID;
        long timestamp;

        Material(String title, String subject, String description,
                 String fileType, int fileSizeKB, String uploaderID) {
            this.id = counter++;
            this.title = title;
            this.subject = subject.toUpperCase();
            this.description = description;
            this.fileType = fileType.toUpperCase();
            this.fileSizeKB = fileSizeKB;
            this.uploaderID = uploaderID;
            this.timestamp = System.currentTimeMillis();
        }

        public String toString() {
            return String.format(
                "  [#%d] %-30s | Subject: %-6s | Type: %-3s | Size: %dKB | By: %s\n" +
                "       Desc: %s",
                id, title, subject, fileType, fileSizeKB, uploaderID, description);
        }
    }

    static class LostItem {
        static int counter = 1;
        int id;
        String itemName;
        String category;
        String status; // LOST | FOUND
        String reporterID;
        long timestamp;

        LostItem(String itemName, String category, String status, String reporterID) {
            this.id = counter++;
            this.itemName = itemName;
            this.category = category;
            this.status = status.toUpperCase();
            this.reporterID = reporterID;
            this.timestamp = System.currentTimeMillis();
        }

        public String toString() {
            return String.format("  [#%d] %-25s | Category: %-12s | Status: %-5s | By: %s",
                id, itemName, category, status, reporterID);
        }
    }

    // ==================== GLOBAL STATE ====================

    static Map<String, Student>   studentDB  = new HashMap<>();
    static Map<Integer, Material> materialDB = new HashMap<>();
    static Map<Integer, LostItem> lostDB     = new HashMap<>();
    static Trie                   searchTrie = new Trie();
    static String                 currentUser = null;
    static Scanner                sc         = new Scanner(System.in);

    static final List<String> CATEGORIES = Arrays.asList("FWD", "MAI", "DSA", "CSE", "CODING");
    static final List<String> FILE_TYPES  = Arrays.asList("PDF", "DOC", "ZIP");

    // ==================== SEED DATA ====================

    static void seedData() {
        // Seed students
        studentDB.put("S001", new Student("S001", "Alice"));
        studentDB.put("S002", new Student("S002", "Bob"));
        studentDB.put("S003", new Student("S003", "Charlie"));

        // Seed materials
        addMaterial(new Material("Binary Trees Notes",        "DSA",   "Complete notes on binary trees",   "PDF", 340,  "S001"));
        addMaterial(new Material("HTML & CSS Basics",         "FWD",   "Intro to HTML5 and CSS3",          "PDF", 210,  "S002"));
        addMaterial(new Material("Sorting Algorithms Guide",  "DSA",   "Merge, Quick, Heap sort explained","DOC", 180,  "S001"));
        addMaterial(new Material("React Hooks Tutorial",      "FWD",   "useState, useEffect deep dive",    "PDF", 500,  "S003"));
        addMaterial(new Material("Linear Algebra for AI",     "MAI",   "Vectors, matrices, eigenvalues",   "PDF", 620,  "S002"));
        addMaterial(new Material("Python DSA Problems",       "CODING","50 coding problems solved",        "ZIP", 900,  "S003"));
        addMaterial(new Material("Grammar & Writing Skills",  "CSE",   "Academic English writing guide",   "DOC", 270,  "S001"));
        addMaterial(new Material("Graph Algorithms",          "DSA",   "BFS, DFS, Dijkstra explained",     "PDF", 410,  "S002"));

        // Seed lost & found
        lostDB.put(LostItem.counter, new LostItem("Blue Water Bottle",  "Personal",   "LOST",  "S001")); LostItem.counter++;
        lostDB.put(LostItem.counter, new LostItem("Scientific Calculator","Stationery","FOUND", "S002")); LostItem.counter++;
        lostDB.put(LostItem.counter, new LostItem("Gray Laptop Sleeve",  "Electronics","LOST",  "S003")); LostItem.counter++;
    }

    static void addMaterial(Material m) {
        materialDB.put(m.id, m);
        studentDB.get(m.uploaderID).uploadCount++;
        // Index title words into Trie
        for (String word : m.title.split("\\s+")) searchTrie.insert(word, m.id);
        // Index subject into Trie
        searchTrie.insert(m.subject, m.id);
    }

    // ==================== UI HELPERS ====================

    static void header(String title) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("   " + title);
        System.out.println("=".repeat(60));
    }

    static void line() { System.out.println("-".repeat(60)); }

    static String input(String prompt) {
        System.out.print(prompt);
        return sc.nextLine().trim();
    }

    static int menuChoice(int max) {
        while (true) {
            String raw = input("  >> Enter choice: ");
            try {
                int v = Integer.parseInt(raw);
                if (v >= 1 && v <= max) return v;
            } catch (NumberFormatException ignored) {}
            System.out.println("  [!] Invalid choice. Try again.");
        }
    }

    // ==================== SCREENS ====================

    // ---------- Login ----------
    static void loginScreen() {
        header("VIRTUAL SHARING PORTAL  |  Login");
        System.out.println("  Enter your University Roll Number to access the portal.");
        System.out.println("  (Seeded IDs: S001, S002, S003 — or type a new one)");
        line();
        while (true) {
            String roll = input("  Roll Number: ").toUpperCase();
            if (roll.isEmpty()) { System.out.println("  [!] Roll number cannot be empty."); continue; }

            if (!studentDB.containsKey(roll)) {
                System.out.print("  New student detected. Enter your name: ");
                String name = sc.nextLine().trim();
                if (name.isEmpty()) name = "Student_" + roll;
                studentDB.put(roll, new Student(roll, name));
                System.out.println("  [+] Account created. Welcome, " + name + "!");
            } else {
                System.out.println("  [✓] Welcome back, " + studentDB.get(roll).name + "!");
            }
            currentUser = roll;
            return;
        }
    }

    // ---------- Dashboard ----------
    static void dashboard() {
        Student s = studentDB.get(currentUser);
        header("DASHBOARD  |  " + s.name + " (" + s.rollNumber + ")");
        System.out.printf("  📁  Files Uploaded : %d%n", s.uploadCount);
        System.out.printf("  ❓  Open Queries   : %d%n", s.queryCount);
        System.out.printf("  📚  Total Materials: %d%n", materialDB.size());
        System.out.printf("  🔍  Lost & Found   : %d items%n", lostDB.size());
        line();
        System.out.println("  [1] Go to Repository");
        System.out.println("  [2] Upload Material");
        System.out.println("  [3] Search Materials");
        System.out.println("  [4] Lost & Found Hub");
        System.out.println("  [5] Logout");
        line();
        int ch = menuChoice(5);
        switch (ch) {
            case 1 -> repositoryScreen(null);
            case 2 -> uploadScreen();
            case 3 -> searchScreen();
            case 4 -> lostFoundScreen();
            case 5 -> { currentUser = null; System.out.println("  [✓] Logged out."); }
        }
    }

    // ---------- Repository (with filter) ----------
    static void repositoryScreen(String filterCategory) {
        header("ACADEMIC REPOSITORY");

        // Build filtered list
        List<Material> list = new ArrayList<>(materialDB.values());
        if (filterCategory != null) {
            list.removeIf(m -> !m.subject.equals(filterCategory));
        }

        // QuickSort by title (DSA: divide-and-conquer)
        quickSort(list, 0, list.size() - 1);

        System.out.println("  Filter: " + (filterCategory == null ? "ALL" : filterCategory));
        line();
        System.out.println("  Category Filters:");
        System.out.println("  [1] ALL  [2] FWD  [3] MAI  [4] DSA  [5] CSE  [6] CODING  [7] Back");
        line();

        if (list.isEmpty()) {
            System.out.println("  (No materials in this category)");
        } else {
            for (Material m : list) {
                System.out.println(m);
                System.out.println();
            }
        }
        line();

        int ch = menuChoice(7);
        switch (ch) {
            case 1 -> repositoryScreen(null);
            case 2 -> repositoryScreen("FWD");
            case 3 -> repositoryScreen("MAI");
            case 4 -> repositoryScreen("DSA");
            case 5 -> repositoryScreen("CSE");
            case 6 -> repositoryScreen("CODING");
            case 7 -> dashboard();
        }
    }

    // QuickSort on Material list by title (DSA)
    static void quickSort(List<Material> list, int lo, int hi) {
        if (lo < hi) {
            int p = partition(list, lo, hi);
            quickSort(list, lo, p - 1);
            quickSort(list, p + 1, hi);
        }
    }

    static int partition(List<Material> list, int lo, int hi) {
        String pivot = list.get(hi).title.toLowerCase();
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (list.get(j).title.toLowerCase().compareTo(pivot) <= 0) {
                i++;
                Collections.swap(list, i, j);
            }
        }
        Collections.swap(list, i + 1, hi);
        return i + 1;
    }

    // ---------- Upload Material ----------
    static void uploadScreen() {
        header("UPLOAD MATERIAL");

        String title = input("  Title       : ");
        if (title.isEmpty()) { System.out.println("  [!] Title required."); dashboard(); return; }

        System.out.println("  Categories: " + CATEGORIES);
        String subject = input("  Category    : ").toUpperCase();
        if (!CATEGORIES.contains(subject)) { System.out.println("  [!] Invalid category."); dashboard(); return; }

        String desc = input("  Description : ");

        System.out.println("  File Types: " + FILE_TYPES);
        String ftype = input("  File Type   : ").toUpperCase();
        if (!FILE_TYPES.contains(ftype)) { System.out.println("  [!] Invalid file type."); dashboard(); return; }

        int size = 0;
        while (size <= 0 || size > 10240) {
            try { size = Integer.parseInt(input("  Size (KB, max 10240): ")); }
            catch (NumberFormatException e) {}
            if (size <= 0 || size > 10240) System.out.println("  [!] Enter a valid size (1–10240 KB).");
        }

        Material m = new Material(title, subject, desc, ftype, size, currentUser);
        addMaterial(m);
        System.out.println("\n  [✓] Material '" + title + "' uploaded successfully! (ID: #" + m.id + ")");
        line();
        System.out.println("  [1] Upload Another  [2] Back to Dashboard");
        if (menuChoice(2) == 1) uploadScreen();
        else dashboard();
    }

    // ---------- Search (Trie-based) ----------
    static void searchScreen() {
        header("SEARCH MATERIALS  (Trie-based prefix search)");
        String query = input("  Enter title/subject keyword: ");
        if (query.isEmpty()) { dashboard(); return; }

        List<Integer> ids = searchTrie.search(query);
        boolean found = false;

        System.out.println("\n  Results for \"" + query + "\":");
        line();
        for (int id : ids) {
            if (materialDB.containsKey(id)) {
                System.out.println(materialDB.get(id));
                System.out.println();
                found = true;
            }
        }
        if (!found) System.out.println("  (No materials matched your search)");
        line();
        System.out.println("  [1] Search Again  [2] Back to Dashboard");
        if (menuChoice(2) == 1) searchScreen();
        else dashboard();
    }

    // ---------- Lost & Found ----------
    static void lostFoundScreen() {
        header("LOST & FOUND HUB");
        System.out.println("  [1] View All Items");
        System.out.println("  [2] View LOST only");
        System.out.println("  [3] View FOUND only");
        System.out.println("  [4] Report New Item");
        System.out.println("  [5] Mark Item as FOUND");
        System.out.println("  [6] Back to Dashboard");
        line();
        int ch = menuChoice(6);
        switch (ch) {
            case 1 -> listLostItems(null);
            case 2 -> listLostItems("LOST");
            case 3 -> listLostItems("FOUND");
            case 4 -> reportLostItem();
            case 5 -> markFound();
            case 6 -> dashboard();
        }
    }

    static void listLostItems(String statusFilter) {
        line();
        System.out.println("  Status: " + (statusFilter == null ? "ALL" : statusFilter));
        line();
        boolean any = false;
        // LinkedHashMap preserves insertion order (DSA: ordered map)
        for (LostItem item : lostDB.values()) {
            if (statusFilter == null || item.status.equals(statusFilter)) {
                System.out.println(item);
                any = true;
            }
        }
        if (!any) System.out.println("  (No items)");
        line();
        System.out.println("  [1] Back to L&F Menu  [2] Dashboard");
        if (menuChoice(2) == 1) lostFoundScreen(); else dashboard();
    }

    static void reportLostItem() {
        header("REPORT ITEM");
        String name   = input("  Item Name  : ");
        String cat    = input("  Category   : ");
        System.out.println("  Status options: LOST | FOUND");
        String status = input("  Status     : ").toUpperCase();
        if (!status.equals("LOST") && !status.equals("FOUND")) {
            System.out.println("  [!] Invalid status. Defaulting to LOST.");
            status = "LOST";
        }
        LostItem item = new LostItem(name, cat, status, currentUser);
        lostDB.put(item.id, item);
        studentDB.get(currentUser).queryCount++;
        System.out.println("  [✓] Item reported successfully! (ID: #" + item.id + ")");
        line();
        System.out.println("  [1] Report Another  [2] Back");
        if (menuChoice(2) == 1) reportLostItem(); else lostFoundScreen();
    }

    static void markFound() {
        listLostItems("LOST");
        String raw = input("  Enter Item ID to mark as FOUND (0 to cancel): ");
        try {
            int id = Integer.parseInt(raw);
            if (id == 0) { lostFoundScreen(); return; }
            if (lostDB.containsKey(id)) {
                lostDB.get(id).status = "FOUND";
                System.out.println("  [✓] Item #" + id + " marked as FOUND.");
            } else {
                System.out.println("  [!] Item not found.");
            }
        } catch (NumberFormatException e) {
            System.out.println("  [!] Invalid ID.");
        }
        lostFoundScreen();
    }

    // ==================== MAIN ====================

    public static void main(String[] args) {
        seedData();
        System.out.println("\n  ╔══════════════════════════════════════════╗");
        System.out.println("  ║   VIRTUAL SHARING  — Console Edition     ║");
        System.out.println("  ║   DSA: HashMap · Trie · QuickSort        ║");
        System.out.println("  ╚══════════════════════════════════════════╝");

        while (true) {
            if (currentUser == null) {
                loginScreen();
            }
            if (currentUser != null) {
                dashboard();
            } else {
                System.out.println("\n  [1] Login Again  [2] Exit");
                if (menuChoice(2) == 2) {
                    System.out.println("\n  Goodbye! 👋\n");
                    break;
                }
            }
        }
        sc.close();
    }
}

