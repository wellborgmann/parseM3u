const socket = io();

function progressControll(data) {
  data.percent = data.percent.replace("Bytes", "").replace("undefined");
  const html = `
  <div class="box-progress">
    <span>Tamanho:</span>
    ${data.total}
  </div>
  
    <div class="box-progress">
    <span>Total:</span>
    ${data.current}
  </div>
   <div class="box-progress">
    <span>Porcentagem:</span>
    ${data.percent}%
  </div>
    `
  document.getElementById("progresso").innerHTML = html;

}

//const linkServer = "http://dark.topk.live/get.php?username=842682650&password=847319553&type=m3u_plus";
let linkServer = "http://bullbr.xyz/get.php?username=48889795&password=41162857&type=m3u_plus";
const collectionLinks = [
  "http://newoneblack.site:80/1440663/123456/234179&type=m3u_plus",
  "http://bullbr.xyz/get.php?username=48889795&password=41162857&type=m3u_plus",
  "http://Showbola.xyz:80/get.php?username=765912644&password=211169427&type=m3u==="

]
let jsonData;
let todoConteudo;
// --- VARIÁVEIS GLOBAIS ---
const apiKey = "f8d7dfb67790d3b848918b8f5f87d8c8"; // Mantenha sua chave
let Midias = {};
let originalMidias = {};
let player;

// Elementos do DOM
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const searchInput = document.getElementById('searchInput');
const playerOverlay = document.getElementById('player-overlay');
const videoTitleLabel = document.getElementById('video-title');
const closePlayerButton = document.getElementById('close-player');

// --- SISTEMA DE PAGINAÇÃO ---
const ITEMS_PER_PAGE = 24; // Mais itens por página para um grid
let currentPage = {
  canais: 1,
  filmes: 1,
  series: 1,
};


  socket.on('updateUserCount', (count) => {
      console.log('Contagem de usuários recebida:', count);

      const userCountElement = document.querySelector(".online > h3")
      // Atualiza o texto do elemento com a nova contagem
      userCountElement.textContent = count;
    });


const btnSidebar = document.querySelector(".btn-sidebar");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

sidebarOverlay.addEventListener("click",closeSidebar)

function closeSidebar(){
  sidebarOverlay.classList.remove("active");
  sidebar.classList.remove("active");
}

btnSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  if (sidebar.classList.contains("active")) {
    sidebarOverlay.classList.add("active");
    return
  }

  sidebarOverlay.classList.remove("active");
})
// #################################################################
// ### LÓGICA DO PLAYER (ADAPTADA PARA O OVERLAY) ###
// #################################################################

function ajustarUrlCanal(url) {
  if (url && !url.endsWith('.m3u8')) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}/live${urlObj.pathname}.m3u8`;
    } catch (e) {
      return url;
    }
  }
  return url;
}

function initPlayer(url, tipo, nome, info = {}) {

  document.body.style.overflow = "hidden";
  videoTitleLabel.textContent = `Carregando: ${nome}...`;
  playerOverlay.style.backgroundImage = `url(${info.capa || ''})`;
  playerOverlay.classList.add('active'); // Mostra o overlay

  if (player) {
    player.dispose();
  }

  // Verifica se info.generos é um array
  let divs = "";
  if (Array.isArray(info.generos)) {
    divs = info.generos.map(item => `<div>${item}</div>`).join("");
  }

  // Garante que sinopse não seja undefined
  const sinopse = info.sinopse || "";

  // Atualiza o conteúdo da descrição, incluindo o botão de transmitir
  document.querySelector('#description').innerHTML = `
    <video id="video" class="video-js vjs-default-skin" controls preload="auto"></video>
    <div class="grid-generos">
      <div>${divs}</div>
    </div>
    <span class="sinopse">${sinopse}</span>
    </div>
    <button id="cast-button" class="cast-btn">Transmitir para TV</button>
  `;
//
  document.getElementById('close-player').addEventListener('click', closePlayer);

  // Inicializa o player
  player = videojs('video', {
    autoplay: false,
    fluid: true,
    touchControls: {
      seekSeconds: 5
    },
    controlBar: {
      skipButtons: {
        forward: 10,
        backward: 10
      }
    },
    playbackRates: [0.5, 1, 1.5, 2]
  });

  // Ajusta a URL para canais se necessário
  let src_type = url.endsWith('.mp4') ? "video/mp4" : "application/x-mpegURL";
  if (tipo === 'canais') url = ajustarUrlCanal(url);

  player.src({ src: url, type: src_type });
  player.poster(info.capa);
  player.posterImage.show();

  player.ready(() => {
    videoTitleLabel.textContent = nome;
  });

  // Histórico da modal
  history.pushState({ modalOpen: true }, "", location.href + "#modal");

  //Botão de transmitir
  const castBtn = document.getElementById('cast-button');
  castBtn.addEventListener('click', () => {
    Android.openCastMenu();

  });
}

function bloquearVoltar() {
  history.pushState(null, "", location.href);
}


function closePlayer() {
  document.body.style.overflow = "auto";
  if (player) {
    player.dispose();
    player = null;
  }
  playerOverlay.classList.remove('active');

  // Remove o hash e estado do histórico apenas se estiver com o modal aberto
  if (location.hash === "#modal") {
    history.pushState(null, "", location.pathname); // remove o hash
  }
}


function closeEpisodes() {
  let episodeSection = document.getElementById('episode-section');
  const mainContent = document.querySelector('.main-content');

  episodeSection.remove();
  mainContent.style.display = 'block';

  if (location.hash === "#modalEpisodes") {
    history.pushState(null, "", location.pathname); // remove o hash
  }
}

window.addEventListener("popstate", (event) => {
  if (playerOverlay.classList.contains('active')) {
    closePlayer();
  }
  closeEpisodes();
});








closePlayerButton.addEventListener('click', () => {
  closePlayer();
});


// #################################################################
// ### LÓGICA DE RENDERIZAÇÃO DE CONTEÚDO (NOVA) ###
// #################################################################

function createContentCard(item, type) {
  const card = document.createElement('div');
  card.className = 'content-card';

  const capa = (item.capa && !String(item.capa).includes("undefined")) ? item.capa : item.capa;

  card.innerHTML = `
            <img src="${capa}" alt="Pôster">
            <div class="card-overlay">
                <h3>${item.name}</h3>
                <button class="play-button">▶</button>
            </div>
        `;

  card.addEventListener('click', () => {
    if (type === 'series') {
      // Para séries, o clique mostra a lista de episódios
      showEpisodeList(item.name, item);

    } else {
      initPlayer(item.link, type, item.name, item);
    }
  });

  return card;
}

// cache simples
const movieInfoCache = {};

async function renderPaginatedGrid(type, busca) {
  const section = document.getElementById(type);
  if (!section) return;

  const gridContainer = section.querySelector(".grid-container");
  const paginationControls = section.querySelector(".pagination-controls");

  // Limpa apenas o grid de conteúdo no início
  if (gridContainer) {
    while (gridContainer.firstChild) {
      gridContainer.removeChild(gridContainer.firstChild);
    }
  }

  const page = currentPage[type] || 1;

  // Pega os itens (do busca ou do backend)
  let items = [];
  let totalPages = 1;

  if (busca) {
    items = type === "filmes" ? busca.movies :
            type === "series" ? busca.series : busca.channels;
    totalPages = Math.ceil((items || []).length / ITEMS_PER_PAGE);
    items = (items || []).slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  } else {
    try {
      const res = await fetch(`/api/midias/${type}?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      items = data.items;
      console.log("Itens recebidos:", items);
      totalPages = data.totalPages;
    } catch (error) {
      console.error(`Erro ao buscar midias do tipo ${type}:`, error);
      items = [];
      totalPages = 1;
    }
  }

  // Renderiza os cards
  if (items && items.length > 0) {
    const detailPromises = items.map(item => {
      if (type === "series" || type === "filmes") {
        if (movieInfoCache[item.name]) {
          return Promise.resolve({ ...item, ...movieInfoCache[item.name] });
        }
        return fetchMovieInfo(item.name, type === "series")
          .then(details => {
            movieInfoCache[item.name] = details;
            return { ...item, ...details };
          })
          .catch(error => {
            console.error("Erro ao buscar detalhes para:", item.name, error);
            return item;
          });
      }
      return Promise.resolve(item);
    });
   
    const fullItems = await Promise.all(detailPromises);
    fullItems.forEach(fullItem => {
      const card = createContentCard(fullItem, type);
      if (gridContainer) {
        gridContainer.appendChild(card);
      }
    });
  }

  // Limpa e renderiza a paginação no final
  if (paginationControls) {
    while (paginationControls.firstChild) {
      paginationControls.removeChild(paginationControls.firstChild);
    }

    if (totalPages > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Anterior";
      prevButton.disabled = page === 1;
      prevButton.onclick = () => {
        currentPage[type]--;
        renderPaginatedGrid(type, busca);
      };

      const pageInfo = document.createElement("span");
      pageInfo.textContent = `Página ${page} de ${totalPages}`;

      const nextButton = document.createElement("button");
      nextButton.textContent = "Próximo";
      nextButton.disabled = page === totalPages;
      nextButton.onclick = () => {
        currentPage[type]++;
        renderPaginatedGrid(type, busca);
      };

      paginationControls.appendChild(prevButton);
      paginationControls.appendChild(pageInfo);
      paginationControls.appendChild(nextButton);
    }
  }
}



    // Função especial para mostrar a lista de episódios de uma série
    async function showEpisodeList(seriesName, item) {
  // 🔹 Busca no servidor
  const res = await fetch(`/api/midias/series/${encodeURIComponent(seriesName)}`);
  if (!res.ok) {
    alert("Erro ao buscar episódios");
    return;
  }
  const episodes = await res.json();

  if (!episodes || episodes.length === 0) {
    alert("Nenhum episódio encontrado.");
    return;
  }

  // Esconde a visualização principal
  const mainContent = document.querySelector('.main-content');
  mainContent.style.display = 'none';

  // Remove seção antiga se existir
  let episodeSection = document.getElementById('episode-section');
  if (episodeSection) episodeSection.remove();

  // Cria nova seção
  episodeSection = document.createElement('section');
  episodeSection.id = 'episode-section';
  episodeSection.className = 'content-section active';

  // Agrupa episódios por temporada
  const seasons = episodes.reduce((acc, ep) => {
    const season = ep.season || 1;
    if (!acc[season]) acc[season] = [];
    acc[season].push(ep);
    return acc;
  }, {});

  // Cria o HTML das temporadas e episódios
  Object.keys(seasons).forEach(seasonNumber => {
    const seasonContainer = document.createElement('div');
    seasonContainer.className = 'season-container';

    const seasonTitle = document.createElement('h3');
    seasonTitle.className = 'season-title';
    seasonTitle.textContent = `Temporada ${seasonNumber}`;
    seasonContainer.appendChild(seasonTitle);

    const episodesGrid = document.createElement('div');
    episodesGrid.className = 'episodes-grid';

    seasons[seasonNumber].forEach(ep => {
      const card = document.createElement('div');
      card.className = 'episode-card';

      // Conteúdo do card
      card.innerHTML = `
        <div class="episode-number">E${ep.episode}</div>
        <div class="episode-name"></div>
      `;
      card.querySelector('.episode-name').textContent = ep.name;

      // Adiciona clique no card
      card.addEventListener('click', () => {
        initPlayer(ep.link, 'series', `${seriesName} - ${ep.name}`, {
          capa: item.capa,
          sinopse: ep.name
        });
      });

      episodesGrid.appendChild(card);
    });

    seasonContainer.appendChild(episodesGrid);
    episodeSection.appendChild(seasonContainer);
  });

  // Cabeçalho do modal
  const header = document.createElement('div');
  header.className = 'episode-header';
  header.style.backgroundImage = `url('${item.capa}')`;

  const overlay = document.createElement('div');
  overlay.className = 'episode-header-overlay';

  const backButton = document.createElement('button');
  backButton.id = 'back-to-series';
  backButton.className = 'back-button';
  backButton.textContent = '← Voltar';
  backButton.addEventListener('click', () => {
    episodeSection.remove();
    mainContent.style.display = 'block';
  });

  const title = document.createElement('h2');
  title.textContent = seriesName;

  overlay.appendChild(backButton);
  overlay.appendChild(title);
  header.appendChild(overlay);

  // Adiciona cabeçalho e episódios na seção
  episodeSection.prepend(header);

  document.body.appendChild(episodeSection);

  history.pushState({ modalEpisodesOpen: true }, "", location.href + "#modalEpisodes");
}




    // #################################################################
    // ### NAVEGAÇÃO, BUSCA E INICIALIZAÇÃO ###
    // #################################################################

    function switchTab(targetId) {
      // Esconde todas as seções de forma explícita
      contentSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });
      navLinks.forEach(link => link.classList.remove('active'));

      // Mostra a seção alvo
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
      }

      // Ativa o link de navegação correspondente
      const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
      if (targetLink) {
        targetLink.classList.add('active');
      }

      // Renderiza o conteúdo da nova aba
      if (targetSection) {
        renderPaginatedGrid(targetId);
      }
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(e.target.dataset.target);
        closeSidebar();
      });
    });

    document.querySelectorAll(".main-nav li").forEach(li => {
  li.addEventListener("click", () => {
    li.querySelector("a").click();
  });
});



    function debounce(func, delay = 1000) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }

    const handleSearch = debounce((e) => {
      buscarDados(e.target.value);
    }, 500);

    // ✅ Agora o handleSearch já existe
    document.getElementById("searchInput").addEventListener('keyup', handleSearch);

    async function buscarDados() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      let data;
      if (!searchTerm) {
        Midias = JSON.parse(JSON.stringify(originalMidias)); // Restaura
      } else {
        const res = await fetch(`/api/midias/buscar/${searchTerm}`);
         data = await res.json();
        console.log(data)
      }

      // Reseta a paginação e re-renderiza a aba ativa
      Object.keys(currentPage).forEach(k => currentPage[k] = 1);
      const activeTab = document.querySelector('.nav-link.active').dataset.target;
      renderPaginatedGrid(activeTab, data);
    }

    searchInput.addEventListener('input', handleSearch);

    async function initializeApp() {
      // ### COLE AQUI SUAS FUNÇÕES DE FETCH ###
      // Exemplo: controller(), OrganizarCategorias(), fetchMovieInfo(), etc.
      // Por agora, vou usar dados de exemplo.

      // Simulação de carregamento de dados

      // Substitua esta parte pela chamada da sua função `controller()` e `OrganizarCategorias()`
      // Ex: await controller();
      // Ex: await OrganizarCategorias();

      // Dados de exemplo para teste:

      // Fim dos dados de exemplo

      originalMidias = JSON.parse(JSON.stringify(Midias)); // Salva cópia original

      // Renderiza a primeira aba (Filmes)
      switchTab('filmes');
    }

    function listaCompleta() {
      const conteudoFiltrado = todoConteudo.filter((a) => a.group.toLowerCase() !== "onlyfans");

      const objetoGrupo = conteudoFiltrado.map((objeto) => {
        return objeto.items;
      });
      const concatenatedArray = objetoGrupo.flat();
      return concatenatedArray;
    }
    async function OrganizarCategorias() {
      Midias = await organizeMedia(listaCompleta(todoConteudo));


      originalMidias = JSON.parse(JSON.stringify(Midias));
      initializeApp();
    }
    // Inicia a aplicação


    async function controller() {
      download()
        .then(async (m3u8Text) => {
          jsonData = parseM3U8(m3u8Text);
          jsonData = filtrarConteudoAdulto(jsonData);
          const lista = jsonData;
          await storeData(jsonData);
          todoConteudo = lista;
          carregarDados();
          await openDatabase();
          await clearDatabase();
          const listaOrganizada = organizeMedia(lista);
          await storeData(lista);
          currentPage[typeMidia] = 1
          loadStoredData();
        })
        .catch((error) => {
          console.log("error##", error);
        });
    }

    switchTab('filmes');


    const serverOptions = document.querySelector(".server-options");
    function baixar() {
      linkServer = collectionLinks[1];
      serverOptions.innerHTML = "";

      const linkAtual = localStorage.getItem("link");

      collectionLinks.forEach((link, index) => {
        const html = ` 
      <div class="server-name">
        <i class="fas fa-globe-americas"></i>
        <span>Servidor ${index + 1} (Lista)</span>
      </div>
      <span class="server-ping">IPTV</span>
    `;

        const div = document.createElement("div");
        div.dataset.server = index;
        div.classList.add("server-option");
        div.innerHTML = html;

        // Restaurar seleção ao criar o botão
        if (linkAtual !== null && parseInt(linkAtual) === index) {
          div.classList.add("selected");
          selectedServer = collectionLinks[index]; // também restaura a variável
        }

        // Clique no botão
        div.addEventListener('click', () => {
          const serverOptions2 = document.querySelectorAll(".server-option");
          serverOptions2.forEach(opt => opt.classList.remove('selected'));
          div.classList.add('selected');
          selectedServer = collectionLinks[index];
          console.log("Servidor selecionado:", selectedServer);
          localStorage.setItem("link", index);
        });

        serverOptions.appendChild(div);
      });

      modal.style.display = "block";
    }


    function downloadError() {
      const divProgresso = document.getElementById("progresso");

    }




    const modal = document.getElementById("serverModal");

    const closeBtn = document.getElementsByClassName("close-btn")[0];
    const confirmBtn = document.getElementById("confirmBtn");
    const serverOptions2 = document.querySelectorAll(".server-option");



    closeBtn.onclick = function () {
      modal.style.display = "none";
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }


    confirmBtn.onclick = function () {
      if (selectedServer) {
        controller();
        //modal.style.display = "none";
      } else {
        alert("Por favor, selecione um servidor.");
      }
    }


// adb shell input text 7093
// adb shell input keyevent 66
