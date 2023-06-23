const END_POINT = 'http://localhost:3000';
const books = document.querySelector('.books');
const inputSearch = document.querySelector('#inputSearch');
const btnSearch = document.querySelector('#btnSearch');

const template = {
    Book: book => {
        return `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>
        `;
    },
};

function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = template.Book(book);
    return div;
}

function ExecutaServico(metodo, sucess, error, messageEror = 'Erro ao executar o serviço') {
    fetch(`${END_POINT}/${metodo}`)
        .then(data => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then(data => { sucess(data); })
        .catch(err => {
            swal('Erro', messageEror, 'error');
            console.error(err);
            error(err);
        });
}

function calculateShipping() {
    const id = event.target.getAttribute('data-id');
    const cep = document.querySelector(`.book[data-id="${id}"] input`).value;

    if (!cep) {
        swal('Frete', 'Por favor, informe o CEP', 'warning');
        return;
    }

    ExecutaServico(`shipping/${cep}`, data => swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success'), err => { }, 'Erro ao calcular o frete');
}

function getBook(id) {
    if (!id) {
        getALLBooks();
        return;
    }

    books.innerHTML = '';

    ExecutaServico(`product/${id}`, (data) => {
        if (!data)
            return;

        books.appendChild(newBook(data));
    }, err => { }, 'Erro ao buscar o produto');
}

function getALLBooks() {
    books.innerHTML = '';

    ExecutaServico('products', (data) => {
        if (!data)
            return;

        data.forEach(book => books.appendChild(newBook(book)));

        document.querySelectorAll('.button-shipping').forEach(btn => btn.addEventListener('click', calculateShipping));
        document.querySelectorAll('.button-buy').forEach(btn =>
            btn.addEventListener('click', e =>
                swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success')));
    }, (err) => { }, 'Erro ao listar os produtos');
}

document.addEventListener('DOMContentLoaded', function () {
    btnSearch.addEventListener('click', () => getBook(inputSearch.value));
    getALLBooks();
});
