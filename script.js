import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCVUwLRi-9NtJkh9U2jDEA2vTogkYL_1yE",
    authDomain: "manga-9496c.firebaseapp.com",
    projectId: "manga-9496c",
    storageBucket: "manga-9496c.appspot.com",
    messagingSenderId: "61365467765",
    appId: "1:61365467765:web:7ecd46b2abb88a27d3563c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addManga = async (rut, nombre, apellido, mangaSolicitado, email, fechaSalida, fechaEntrega) => {
    try {
        await addDoc(collection(db, "mangas"), {
            rut,
            nombre,
            apellido,
            mangaSolicitado,
            email,
            fechaSalida,
            fechaEntrega
        });
        Swal.fire('Éxito', 'Manga registrado exitosamente', 'success');
        loadMangas();
    } catch (error) {
        Swal.fire('Error', 'Error al registrar el manga: ' + error.message, 'error');
    }
};

const updateManga = async (id, rut, nombre, apellido, mangaSolicitado, email, fechaSalida, fechaEntrega) => {
    try {
        await updateDoc(doc(db, "mangas", id), {
            rut,
            nombre,
            apellido,
            mangaSolicitado,
            email,
            fechaSalida,
            fechaEntrega
        });
        Swal.fire('Éxito', 'Manga actualizado exitosamente', 'success');
        loadMangas();
    } catch (error) {
        Swal.fire('Error', 'Error al actualizar el manga: ' + error.message, 'error');
    }
};

const deleteManga = async (id) => {
    try {
        await deleteDoc(doc(db, "mangas", id));
        Swal.fire('Éxito', 'Manga eliminado exitosamente', 'success');
        loadMangas();
    } catch (error) {
        Swal.fire('Error', 'Error al eliminar el manga: ' + error.message, 'error');
    }
};

const loadMangas = async () => {
    const mangaList = document.getElementById("manga-list");
    mangaList.innerHTML = "";
    try {
        const querySnapshot = await getDocs(collection(db, "mangas"));
        querySnapshot.forEach((doc) => {
            const manga = doc.data();
            const li = document.createElement("li");
            li.textContent = `${manga.rut} - ${manga.nombre} ${manga.apellido} - ${manga.mangaSolicitado} - ${manga.email} - ${manga.fechaSalida} - ${manga.fechaEntrega}`;
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.onclick = () => editManga(doc.id, manga);
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.onclick = () => deleteManga(doc.id);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            mangaList.appendChild(li);
        });
    } catch (error) {
        Swal.fire('Error', 'Error al cargar los mangas: ' + error.message, 'error');
    }
};

const editManga = (id, manga) => {
    const editForm = document.getElementById("edit-manga-form");
    document.getElementById("manga-form").style.display = "none";
    editForm.style.display = "block";
    document.getElementById("edit-rut").value = manga.rut;
    document.getElementById("edit-nombre").value = manga.nombre;
    document.getElementById("edit-apellido").value = manga.apellido;
    document.getElementById("edit-manga-solicitado").value = manga.mangaSolicitado;
    document.getElementById("edit-email").value = manga.email;
    document.getElementById("edit-fecha-salida").value = manga.fechaSalida;
    document.getElementById("edit-fecha-entrega").value = manga.fechaEntrega;

    document.getElementById("edit-manga-form").onsubmit = async (e) => {
        e.preventDefault();
        const rut = document.getElementById("edit-rut").value;
        const nombre = document.getElementById("edit-nombre").value;
        const apellido = document.getElementById("edit-apellido").value;
        const mangaSolicitado = document.getElementById("edit-manga-solicitado").value;
        const email = document.getElementById("edit-email").value;
        const fechaSalida = document.getElementById("edit-fecha-salida").value;
        const fechaEntrega = document.getElementById("edit-fecha-entrega").value;
        await updateManga(id, rut, nombre, apellido, mangaSolicitado, email, fechaSalida, fechaEntrega);
        editForm.style.display = "none";
        document.getElementById("manga-form").style.display = "block";
    };

    document.getElementById("cancel-edit").onclick = () => {
        editForm.style.display = "none";
        document.getElementById("manga-form").style.display = "block";
    };
};

document.getElementById("manga-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rut = document.getElementById("rut").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const mangaSolicitado = document.getElementById("manga-solicitado").value;
    const email = document.getElementById("email").value;
    const fechaSalida = document.getElementById("fecha-salida").value;
    const fechaEntrega = document.getElementById("fecha-entrega").value;
    await addManga(rut, nombre, apellido, mangaSolicitado, email, fechaSalida, fechaEntrega);
});

loadMangas();