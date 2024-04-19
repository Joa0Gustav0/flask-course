""" <!-- <div class="pagination-container">
    {% if items.get("index") < 1 %}
    <a class="pagination-container__button disabled">
      <ion-icon name="chevron-back"></ion-icon> Anterior
    </a>
    {% else %}
    <a href="?index={{ items.get('index') - 1 }}" class="pagination-container__button">
      <ion-icon name="chevron-back"></ion-icon> Anterior
    </a>
    {% endif %}
    <p class="pagination-container__index-text">{{ items.get('index') + 1 }}</p>
    <a href="?index={{ items.get('index') + 1 }}" class="pagination-container__button">
      Seguinte <ion-icon name="chevron-forward"></ion-icon>
    </a>
  </div> --> """