
### 1. Grup Oluşturma
```javascript
// Model ve zemin, gridHelper'ı tutmak için bir grup oluşturun
const group = new THREE.Group();
```
Bu satır, model ve zemin gibi nesneleri tutmak için bir 

THREE.Group

 oluşturur. Bu grup, sahneye eklenebilecek ve birlikte hareket ettirilebilecek bir koleksiyon sağlar.

### 2. Model Yükleme
```javascript
loader.load(
  "/models/truck.glb",
  function (gltf) {
    const model = gltf.scene;
```
Bu kısım, bir GLTF modelini yükler. 

loader.load

 fonksiyonu, belirtilen dosya yolundan modeli yükler ve 

gltf

 nesnesini döndürür. 

gltf.scene

 modeli temsil eder.

### 3. Modelin Pozisyon ve Ölçek Ayarları
```javascript
    model.position.set(0, 0.5, 0); // Grid üzerinde kesişmeyi önlemek için pozisyonu ayarlayın
    model.scale.set(2, 2, 2); // Ölçeği ayarlayın
```
Bu satırlar, modelin pozisyonunu ve ölçeğini ayarlar. Modelin grid üzerinde doğru şekilde yerleştirilmesi ve uygun boyutta olması sağlanır.

### 4. Yüksek Kaliteli Malzemelerin Uygulanması
```javascript
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          color: 0x999999, // Renk ayarı
          //wireframe: true, // Tel kafes görünümü (yorum satırı)
          alphaTest: 0.5, // Alfa değeri 0.5'ten küçük olan pikselleri at
          transparent: true, // Şeffaf dokuların işlenmesine izin verir
          side: THREE.DoubleSide, // Her iki tarafı da render et (isteğe bağlı)
          opacity: 0.5, // Şeffaflık ayarı
          wireframeLinewidth: 50, // Tel kafes çizgi kalınlığını kontrol et
          //flatShading: true, // Düz gölgeleme kullanımı (isteğe bağlı)
          metalness: 0.5, // Parlaklık için metalik ayar
          roughness: 0.1, // Pürüzlülük kontrolü
        });

        // Mesh için gölgeleri etkinleştir
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
```
Bu bölüm, modelin her bir `Mesh` (ağ) nesnesine yüksek kaliteli malzemeler uygular. 

MeshStandardMaterial

 kullanılarak renk, şeffaflık, metalik ve pürüzlülük gibi özellikler ayarlanır. Ayrıca, gölgelerin etkinleştirilmesi sağlanır.

### 5. Modelin Sınır Kutusunun Hesaplanması
```javascript
    // Modelin sınır kutusunu hesaplayın
    const box = new THREE.Box3().setFromObject(model);
```
Bu satır, modelin sınır kutusunu hesaplar. 

THREE.Box3

 kullanılarak modelin boyutları belirlenir.

### 6. Sınır Kutusunun Uçlarına Oklar Yerleştirme
```javascript
    // Sınır kutusunun uçlarına oklar yerleştirin
```
Bu kısım, sınır kutusunun uçlarına oklar yerleştirilmesini belirtir. Ancak, bu kodun devamı görünmüyor. Devam eden kodda okların nasıl yerleştirileceği açıklanabilir.

### 7. Modeli Gruba Ekleme
```javascript
    // Modeli gruba ekleyin
    group.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
```
Bu bölümde, yüklenen model 

group

 nesnesine eklenir. Bu, modelin sahneye eklenmesini ve diğer nesnelerle birlikte hareket etmesini sağlar. Ayrıca, yükleme sırasında bir hata oluşursa, bu hata konsola yazdırılır.

### 8. GridHelper ve Zemin Ekleme
```javascript
// GridHelper ve zemin ekleyin
const gridHelper = new THREE.GridHelper(10, 10);
group.add(gridHelper);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
ground.rotation.x = -Math.PI / 2; // Zemin düzlemini yatay hale getirin
ground.receiveShadow = true;
group.add(ground);
```
Bu bölümde, bir `GridHelper` ve zemin oluşturulur ve 

group

 nesnesine eklenir. `GridHelper`, sahnede bir ızgara oluşturur ve zemin, sahnenin tabanını temsil eder. Zemin, gölgeleri alacak şekilde ayarlanır.

### 9. Grubu Sahneye Ekleme
```javascript
// Grubu sahneye ekleyin
scene.add(group);
```
Bu satır, 

group

 nesnesini sahneye ekler. Bu, modelin, grid'in ve zeminin sahnede görünmesini sağlar.

### 10. Işık Kaynağı Ekleme
```javascript
// Işık kaynağı ekleyin
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
light.castShadow = true;
scene.add(light);
```
Bu bölümde, bir yönlü ışık kaynağı oluşturulur ve sahneye eklenir. Işık kaynağı, sahnedeki nesnelerin aydınlatılmasını sağlar ve gölgelerin oluşturulmasına yardımcı olur.

### 11. Kamera ve Kontrolleri Ayarlama
```javascript
// Kamera ve kontrolleri ayarlayın
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();
```
Bu bölümde, bir perspektif kamera oluşturulur ve sahneye eklenir. Kamera, sahnedeki nesneleri görüntülemek için kullanılır. Ayrıca, `OrbitControls` kullanılarak kamera kontrolleri ayarlanır, böylece kullanıcı sahneyi döndürebilir ve yakınlaştırabilir.

### 12. Animasyon Döngüsü
```javascript
// Animasyon döngüsü
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
```
Bu bölümde, bir animasyon döngüsü oluşturulur. `animate` fonksiyonu, her karede `controls.update` ve `renderer.render` fonksiyonlarını çağırarak sahneyi günceller ve yeniden çizer. Bu, sürekli bir animasyon sağlar.


### 13. Modelin Sınır Kutusunun Uçlarına Oklar Yerleştirme
```javascript
    // Sınır kutusunun uçlarına oklar yerleştirin
    const helper = new THREE.Box3Helper(box, 0xffff00);
    group.add(helper);
```
Bu bölümde, modelin sınır kutusunun uçlarına oklar yerleştirilir. `THREE.Box3Helper` kullanılarak sınır kutusunun görselleştirilmesi sağlanır ve bu yardımcı nesne `group` nesnesine eklenir. Bu, modelin sınırlarını görsel olarak belirlemeye yardımcı olur.

### 14. Modelin Döndürülmesi
```javascript
    // Modeli döndürün
    model.rotation.y = Math.PI / 4; // Modeli 45 derece döndürün
```
Bu satır, modelin Y ekseni etrafında 45 derece döndürülmesini sağlar. Bu, modelin sahnede belirli bir açıyla görünmesini sağlar.

### 15. Animasyon Döngüsüne Modelin Eklenmesi
```javascript
    // Animasyon döngüsüne modeli ekleyin
    function animate() {
      requestAnimationFrame(animate);

      model.rotation.y += 0.01; // Modeli sürekli döndürün

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
```
Bu bölümde, animasyon döngüsüne modelin eklenmesi sağlanır. `animate` fonksiyonu, her karede modelin Y ekseni etrafında biraz daha döndürülmesini sağlar. Bu, modelin sahnede sürekli olarak dönmesini sağlar. Ayrıca, `controls.update` ve `renderer.render` fonksiyonları çağrılarak sahne güncellenir ve yeniden çizilir.

### 16. Pencere Yeniden Boyutlandırma Olayı
```javascript
    // Pencere yeniden boyutlandırma olayını işleyin
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
```
Bu bölümde, pencere yeniden boyutlandırıldığında kameranın ve renderer'ın boyutlarının güncellenmesi sağlanır. `resize` olayı dinlenir ve pencere boyutları değiştiğinde kamera ve renderer'ın boyutları yeniden ayarlanır. Bu, sahnenin her zaman doğru oranda görüntülenmesini sağlar.
