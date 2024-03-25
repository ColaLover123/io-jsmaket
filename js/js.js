const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocompleteList');
const repoList = document.getElementById('repoList');

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const fetchRepos = async (query) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
  const data = await response.json();
  return data.items.slice(0, 5);
};

const renderAutocompleteList = (repos) => {
  autocompleteList.innerHTML = '';
  repos.forEach((repo) => {
    const li = document.createElement('li');
    li.textContent = repo.full_name;
    li.addEventListener('click', () => {
      addRepoToList(repo);
      searchInput.value = '';
      autocompleteList.innerHTML = '';
    });
    autocompleteList.appendChild(li);
  });
};

const addRepoToList = (repo) => {
  const li = document.createElement('li');
  li.textContent = `${repo.full_name} - ${repo.stargazers_count} stars`;
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    li.remove();
  });
  li.appendChild(removeBtn);
  repoList.appendChild(li);
};

const handleSearchInput = debounce(async () => {
  const query = searchInput.value.trim();
  if (query) {
    const repos = await fetchRepos(query);
    renderAutocompleteList(repos);
  } else {
    autocompleteList.innerHTML = '';
  }
}, 300);

searchInput.addEventListener('input', handleSearchInput);