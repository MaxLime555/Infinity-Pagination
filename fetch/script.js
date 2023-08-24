//получаю список постов и кнопку, от которой буду отталкиваться
const postList = document.getElementById('postList');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const pageSize = 10;  //количество постов на одной странице
let currentPage = 1;  //с помощью этой переменной буду отслеживать текущую страницу

//кидаю запрос на "сервер" для получения данных
async function fetchPosts(page) { 
    const response = await fetch(`https://dummyjson.com/posts?limit=${pageSize}&page=${page}`);   //вот и переменные пригодились
    const data = await response.json();                                                           //вообще про такой вид запроса с точным количеством постов увидел у ArchakovBlog
    if (data && Array.isArray(data.posts)) {                                                      //у меня даже пет-проект на реакте с такой штукой есть(на гитхабе лежит)
      return data.posts;                                                                          //забыл сказать, что преобразуем полученные данные в json
    } else {
      throw new Error('Ошибка. Что-то пошло не так');   
    }
  }

//создание постов
//даже не знаю, надо ли такие функции комментировать, они говорящие
const createPostElement = (post) => {
  const postItem = document.createElement('div');
  postItem.classList.add('post-item');
  postItem.innerHTML = `
    <h2 class="post-title">${post.title}</h2>
    <p class="post-body">${post.body}</p>
  `;
  return postItem;
}

//ну а тут я загружаю посты с помощью функции, которую выше написал
const loadPosts = (page) => {
    fetchPosts(page)
      .then(posts => {
        posts.forEach(post => {
          const postElement = createPostElement(post);
          postList.appendChild(postElement);
        });
      })
      .catch(error => console.error('Ошибка загрузки постов', error));
  }

//функция "на всякий случай"
//если вдруг обсервер затупит, то при клике вручную увеличится currentPage и появится новая страница постов
loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadPosts(currentPage);
});


//с помощью обсервера отслеживаю появление кнопки
const observer = new IntersectionObserver(entries => {  
  if (entries[0].isIntersecting) {                      
    currentPage++;                                      
    loadPosts(currentPage);
  }
}, { threshold: 1 });                                   //эта штука завершает определение функции
                                                        //значение 1 означает,что сработает только при полном появлении элемента
observer.observe(loadMoreBtn);                          //показываю остлеживаемый элемент(выделил айдишником в html и получил в начале скрипта)


//так, тут я комменчу уже чисто для себя,не обращайте внимания, чтоб в будущем вспомнить, как работает
//я до этого с обсерверами не работал, а они мощные оказывается
//после инициализации обсервера-следопыта я вызываю стрелочную функцию entries, которая начнет работать,
//как только отслеживаемый элемент появится в области видимости. entries - это массив наблюдаемых объектов.
//как только мне попалась кнопка, она окажется первой в массиве.
//isIntersecting вернет true, если элемент полностью видим.
//как только вернулось true, счетчик страниц увеличится и загрузка постов продолжится