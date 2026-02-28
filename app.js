// 1. CDN IMPORTS - Required for browser-only setups
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. YOUR SPECIFIC CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAHDClfdGIHKJ2M73V4_OH3sS2rNEaDczg",
  authDomain: "project-777766369332750349.firebaseapp.com",
  projectId: "project-777766369332750349",
  storageBucket: "project-777766369332750349.firebasestorage.app",
  messagingSenderId: "1029016083578",
  appId: "1:1029016083578:web:92e72e087e38e3ef89afc3",
  measurementId: "G-VPFSXT3RBB"
};

// 3. INITIALIZE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- FEATURE: ADD STUDENT (For index.html) ---
const addBtn = document.getElementById('addBtn');
if (addBtn) {
    addBtn.onclick = async () => {
        const student = {
            id: document.getElementById('stuID').value,
            name: document.getElementById('stuName').value,
            course: document.getElementById('stuCourse').value,
            club: document.getElementById('stuClub').value
        };
        try {
            await addDoc(collection(db, "students"), student);
            alert("SYSTEM_MESSAGE: RECORD_STORED");
            document.querySelectorAll('input').forEach(i => i.value = '');
        } catch (e) { alert("ERROR: " + e.message); }
    };
}

// --- FEATURE: SEARCH (SQL-style Queries) ---
const searchNameBtn = document.getElementById('searchNameBtn');
if(searchNameBtn) {
    searchNameBtn.onclick = () => {
        const val = document.getElementById('searchName').value;
        const q = query(collection(db, "students"), where("name", "==", val));
        renderTable(q);
    };
}

const searchCourseBtn = document.getElementById('searchCourseBtn');
if(searchCourseBtn) {
    searchCourseBtn.onclick = () => {
        const val = document.getElementById('searchCourse').value;
        const q = query(collection(db, "students"), where("course", "==", val));
        renderTable(q);
    };
}

// --- FEATURE: RENDER & DELETE ---
async function renderTable(customQuery = null) {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = ""; 
    const target = customQuery || collection(db, "students");
    const querySnapshot = await getDocs(target);
    
    querySnapshot.forEach((record) => {
        const data = record.data();
        const row = `
            <tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.course}</td>
                <td>${data.club}</td>
                <td>
                    <button onclick="deleteRecord('${record.id}')" style="color:red; border:1px solid red; background:none;">DELETE</button>
                    <button onclick="editRecord('${record.id}', '${data.name}')" style="color:cyan; border:1px solid cyan; background:none;">EDIT</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// --- FEATURE: DELETE & EDIT ---
window.deleteRecord = async (docId) => {
    if(confirm("CONFIRM_DELETION?")) {
        await deleteDoc(doc(db, "students", docId));
        renderTable(); 
    }
};

window.editRecord = async (docId, oldName) => {
    const newName = prompt("ENTER_NEW_NAME", oldName);
    if (newName) {
        await updateDoc(doc(db, "students", docId), { name: newName });
        renderTable();
    }
};

// Initial Load
if(document.getElementById('tableBody')) renderTable();