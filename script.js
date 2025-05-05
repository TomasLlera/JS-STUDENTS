const url = "https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1";

window.onload = function () {
    $('#popUp').hide();
    getStudents();
}

function loadStudents() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);  // Solicitud GET para obtener los datos
        request.responseType = 'json';  // Esperamos respuesta en formato JSON

        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);  // Devuelve los datos al resolvedor
            } else {
                reject(Error(request.statusText));  // Si no funciona, muestra error
            }
        };

        request.onerror = function () {
            reject(Error('Error: unexpected network error'));  // Error de red
        };

        request.send();  // Enviar la solicitud
    });
}

function addStudent() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', url);  // POST para crear estudiante
        request.setRequestHeader('Content-Type', 'application/json');

        var student = JSON.stringify({
            'id': document.getElementById('id').value,
            'nombre': document.getElementById('name').value,
            'apellido': document.getElementById('lastName').value,
            'edad': document.getElementById('age').value,
            'curso': document.getElementById('course').value,
            'nivel': document.getElementById('level').value
        });

        request.onload = function () {
            if (request.status == 201) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = function () {
            reject(Error('Error: unexpected network error'));
        };

        request.send(student);  // Enviamos el objeto JSON al servidor
    });
}

function removeStudent(id) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('DELETE', `${url}/${id}`);  // Cambiar a DELETE para borrar
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = function () {
            reject(Error('Error: unexpected network error'));
        };

        request.send();  // No se envía cuerpo, solo el DELETE
    });
}

function modifyStudent() {
    return new Promise(function (resolve, reject) {
        var id = document.getElementById('id2').value;  // Obtenemos el ID desde el formulario
        var request = new XMLHttpRequest();
        request.open('PATCH', `${url}/${id}`);  // Cambiar a PUT para actualizar
        request.setRequestHeader('Content-Type', 'application/json');

        var student = JSON.stringify({
            'id': id,
            'nombre': document.getElementById('name2').value,
            'apellido': document.getElementById('lastName2').value,
            'edad': document.getElementById('age2').value,
            'curso': document.getElementById('course2').value,
            'nivel': document.getElementById('level2').value
        });

        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = function () {
            reject(Error('Error: unexpected network error.'));
        };

        request.send(student);  // Enviamos los datos actualizados al servidor
    });
}

function getStudents() {
    loadStudents().then(response => {
        var tbody = document.querySelector('tbody');
        tbody.innerHTML = '';  // Limpia la tabla antes de insertar nuevos datos

        // Revisamos que los datos sean correctos y mapeamos a la tabla
        response.data.forEach(e => {
            var row = tbody.insertRow();
            var id = row.insertCell();
            id.innerHTML = e.id;

            var name = row.insertCell();
            name.innerHTML = e.nombre;

            var lastName = row.insertCell();
            lastName.innerHTML = e.apellido;

            var age = row.insertCell();
            age.innerHTML = e.Edad;  // Usamos 'Edad' según el JSON

            var course = row.insertCell();
            course.innerHTML = e.curso;

            var level = row.insertCell();
            level.innerHTML = e.nivel;

            var student = JSON.stringify({
                'id': e.id,
                'name': e.nombre,
                'lastName': e.apellido,
                'age': e.Edad,
                'course': e.curso,
                'level': e.nivel
            });

            var view = row.insertCell();
            view.innerHTML = `<button onclick='viewStudent(${student})'>View</button>`;

            var del = row.insertCell();
            del.innerHTML = `<button onclick='deleteStudent(${e.id})'>Delete</button>`;
        });

        // Limpieza de campos para nuevo estudiante
        document.getElementById('name').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('age').value = '';
        document.getElementById('course').value = '';
        document.getElementById('level').value = '';
        document.getElementById('name').focus();
    }).catch(reason => {
        console.error(reason);
    });
}

function saveStudent() {
    if (
        document.getElementById('id').value.trim() !== '' &&
        document.getElementById('name').value.trim() !== '' &&
        document.getElementById('lastName').value.trim() !== '' &&
        document.getElementById('age').value.trim() !== '' &&
        document.getElementById('course').value.trim() !== '' &&
        document.getElementById('level').value.trim() !== ''
    ) {
        addStudent().then(() => {
            getStudents();
        }).catch(reason => {
            console.error(reason);
        });
    }
}

function viewStudent(student) {    // Muestra datos del estudiante en un formulario emergente para editarlo
    document.getElementById('id2').value = student.id;
    document.getElementById('name2').value = student.name;
    document.getElementById('lastName2').value = student.lastName;
    document.getElementById('age2').value = student.age;
    document.getElementById('course2').value = student.course;
    document.getElementById('level2').value = student.level;

    $('#popUp').dialog({   // Abre el diálogo emergente 
        closeText: ''
    }).css('font-size', '15px');
}

function deleteStudent(id) {
    removeStudent(id).then(() => {
        getStudents();
    }).catch(reason => {
        console.error(reason);
    });
}

function updateStudent() {
    if (
        document.getElementById('name2').value.trim() !== '' &&
        document.getElementById('lastName2').value.trim() !== '' &&
        document.getElementById('age2').value.trim() !== '' &&
        document.getElementById('course2').value.trim() !== '' &&
        document.getElementById('level2').value.trim() !== ''
    ) {
        modifyStudent().then(() => {
            $('#popUp').dialog('close');
            getStudents();
        }).catch(reason => {
            console.error(reason);
        });
    }
}