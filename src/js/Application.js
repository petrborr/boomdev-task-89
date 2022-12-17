import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.querySelector(".progress");
    this.apiURL = "https://swapi.boom.dev/api/planets"

    // const box = document.createElement("div");
    // box.classList.add("box");
    // box.innerHTML = this._render({
    //   name: "Placeholder",
    //   terrain: "placeholder",
    //   population: 0,
    // });

    // document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
    this._startLoading()
    this._load()
    this._stopLoading()
  }

  async _load() {
    let response = await fetch(this.apiURL)
    let data = await response.json()
    this.apiURL = data["next"]
    while (this.apiURL != null) {
      response = await fetch(this.apiURL)
      data = await response.json()
      this.apiURL = data["next"]

      const planets = data["results"]
      for (let planet of planets) {
        this._create(planet)
      }
    }
  }

  _create(planet) {
    const name = planet["name"]
    const terrain = planet["terrain"]
    const population = planet["residents"].length
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({name, terrain, population})
    document.body.querySelector(".main").appendChild(box);
  }

  _startLoading() {
    this._loading.style.display = "block"
  }
  _stopLoading() {
    this._loading.style.display = "none"
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}
