import { getDocs, query, where, deleteDoc, doc, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. FUNCTION TO SEARCH BY COURSE (SQL: SELECT * FROM students WHERE Course = '...')
const searchCourseBtn = document.getElementById('searchCourseBtn');
if(searchCourseBtn) {
    searchCourseBtn.onclick = async () => {
        const courseQuery = document.getElementById('searchCourse').value;
        const q = query(collection(db, "students"), where("course", "==", courseQuery));
        renderTable(q);
    };
}

// 2. FUNCTION TO RENDER DATA INTO THE TABLE
async function renderTable(customQuery = null) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ""; // Clear current table
    
    // If no specific query, get everything
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
                    <button onclick="deleteRecord('${record.id}')" style="background:transparent; border:1px solid red; color:red;">DELETE</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 3. DELETE FUNCTION
window.deleteRecord = async (docId) => {
    if(confirm("PERMANENTLY_DELETE_RECORD?")) {
        await deleteDoc(doc(db, "students", docId));
        renderTable(); // Refresh table
    }
};

// Load table on page start
if(document.getElementById('tableBody')) renderTable();