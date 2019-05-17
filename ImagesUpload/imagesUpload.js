class ImageUpload extends HTMLElement {
  constructor() {
    super();
    this._files = [];
    this._countLimit = 9;
    this._uploadImage = () => {};
    this.setAttribute("style", 'outline: none');
    this._shadowRoot = this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  createImageItemElement(src) {
    // const fragment = document.createDocumentFragment();
    const item = document.createElement('div');
    item.className = 'image-item';
    item.innerHTML = `<img src=${src}  alt="uploaded image"/>`;
    return item;
  }

  updateImagesProview() {

  }

  getInputImage() {
    const wrapper = this._shadowRoot.getElementById('wrapper');
    const appendButton = this._shadowRoot.getElementById('upload-item');
    let selectedFiles = this._shadowRoot.getElementById('custom-upload-images').files;
    this._files.push(selectedFiles[0]);
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const imageSrc = e.target.result;
      const item = this.createImageItemElement(imageSrc);

      wrapper.insertBefore(item, appendButton);
      if (this._files.length > 9) {
        wrapper.removeChild(appendButton);
      }
      selectedFiles = null;
      this._uploadImage()
    };

    fileReader.readAsDataURL(selectedFiles[0]);
  }

  static get observedAttributes() { return ["uploadImage"]; }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name);
    console.log(oldValue);
    console.log(newValue);
    this._uploadImage = newValue;
    this._updateRendering();
  }

  connectedCallback() {
    this._updateRendering();
  }

  get uploadImage() {
    return this._uploadImage;
  }
  set uploadImage(v) {
    console.log(v);
    this.setAttribute("uploadImage", v);
    this._uploadImage = v;
  }

  _updateRendering() {

    const appendImageTemplate = `
      <div class="upload-item image-item" id="upload-item">
        <label for="custom-upload-images">
          <span>Upload</span>
          <input type="file" hidden name="custom-upload-images" id="custom-upload-images" />
        </label>
      </div>
    `;
    this._shadowRoot.addEventListener('change', (event) => { this.getInputImage(event) });
    this._shadowRoot.innerHTML = `
      <style>
        .wrapper { display: flex; flex-wrap: wrap; width: 660px;}
        .upload-item label{
          display: inline-block;
          width: 100%;
          height: 100%;
          background-color: rgb(230, 230, 230);
          text-align: center;
          line-height: 200px;
        }
        .upload-item label input { display: none; }
        .image-item { width: 200px; height: 200px; margin: 5px}
        .image-item img{ width: 200px; height: 200px}
      </style>
      <div id="wrapper" class="wrapper" part="test">
         ${appendImageTemplate}
      </div>
    `;
  }
}

customElements.define("images-upload", ImageUpload);