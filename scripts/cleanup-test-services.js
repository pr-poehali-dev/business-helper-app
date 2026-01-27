const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';

// ID тестовых услуг для удаления
const testServiceIds = [1, 2, 3, 4, 5];

async function deleteTestServices() {
  console.log('Удаляем тестовые услуги...\n');
  
  for (const id of testServiceIds) {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log(`✓ Удалена услуга ID: ${id}`);
      } else {
        const data = await response.json();
        console.log(`✗ Ошибка при удалении ID ${id}: ${data.error}`);
      }
    } catch (error) {
      console.error(`✗ Ошибка при удалении ID ${id}:`, error);
    }
  }
  
  console.log('\n✓ Очистка завершена!');
  console.log('Проверьте оставшиеся услуги на сайте.');
}

deleteTestServices();
