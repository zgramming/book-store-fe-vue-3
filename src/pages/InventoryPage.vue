<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import { useRouter } from 'vue-router';
import useSWRV from 'swrv';
import { inventoryService } from '../services/InventoryService';
import { useField, useForm } from 'vee-validate';
import { getErrorMessageAxios } from '../utils/function';

const router = useRouter();
const limit = ref(10);
const page = ref(1);
const qTitle = ref('');
const selectedInventoryId = ref<number | null>(null);
const isModalRestockVisible = ref<boolean>(false);

// Form Restock

const { handleSubmit } = useForm({
  validationSchema: {
    stock: (value?: number) => {
      if (!value) {
        return 'Stock is required';
      }
      return true;
    },
    action: (value?: string) => {
      if (!value) {
        return 'Action is required';
      }
      return true;
    },
  },
});

const stock = useField('stock');
const action = useField('action');

const {
  data: inventories,
  isValidating,
  mutate: reloadInventories,
} = useSWRV(`/inventories`, async () => {
  return inventoryService.getAllInventories({
    limit: limit.value,
    page: page.value,
    title: qTitle.value,
  });
});

const {
  data: selectedInventory,
  isValidating: isValidatingSelectedInventory,
  mutate: reloadSelectedInventory,
} = useSWRV(`/inventories/${selectedInventoryId}`, async () => {
  return inventoryService.getInventoryById(selectedInventoryId.value ? `${selectedInventoryId.value}` : undefined);
});

const onSubmitRestock = handleSubmit(async (values) => {
  const id = selectedInventory.value?.id;

  if (!id) {
    return;
  }

  try {
    if (values.action === 'increase') {
      await inventoryService.increaseStock(`${id}`, values.stock);
    } else {
      await inventoryService.decreaseStock(`${id}`, values.stock);
    }

    reloadInventories();
    closeModalRestock();
    alert('Success Restock Inventory');
  } catch (error) {
    console.error(error);
    const message = getErrorMessageAxios(error);
    alert(message);
  }
});

const handleReset = () => {
  stock.value.value = undefined;
  action.value.value = undefined;
};

const handlingSearch = (value: string) => {
  qTitle.value = value;
};

const handleNew = () => {
  router.push('/inventory/new');
};

const handleEdit = (id: number) => {
  router.push(`/inventory/${id}`);
};

const openModalRestock = (id: number) => {
  isModalRestockVisible.value = true;
  selectedInventoryId.value = id;
};

const closeModalRestock = () => {
  isModalRestockVisible.value = false;
  selectedInventoryId.value = null;

  handleReset();
};

// Refetch data when limit, page, or qTitle changes
watch([limit, page, qTitle], () => {
  reloadInventories();
});

watch(selectedInventoryId, () => {
  reloadSelectedInventory();
});
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <div class="tw-flex tw-flex-col tw-gap-5">
      <!-- Header Section -->
      <div class="tw-flex tw-items-center tw-gap-5">
        <div class="tw-grow-1 tw-w-full tw-flex justify-start">
          <div class="tw-w-1/2">
            <v-text-field
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @input="handlingSearch($event.target.value)"
            />
          </div>
        </div>
        <div class="tw-grow-1 tw-w-full tw-flex justify-end">
          <v-btn color="green" @click="handleNew"> Add </v-btn>
        </div>
      </div>

      <!-- Table Section -->
      <v-table fixed-header>
        <thead>
          <tr>
            <th>NO</th>
            <th>AUTHOR</th>
            <th>BOOK</th>
            <th>LOCATION</th>
            <th>INITIAL STOCK</th>
            <th>CURRENT STOCK</th>
            <th>CREATED AT</th>
            <th>UPDATED AT</th>
            <th>KONTROL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in inventories?.data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.book.author }}</td>
            <td>{{ item.book.title }}</td>
            <td>{{ item.location }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.current_stock }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
            <td class="tw-flex tw-gap-2 tw-items-center" style="justify-content: center">
              <v-btn color="blue" small @click="handleEdit(item.id)"> Edit </v-btn>
              <v-btn color="purple" small @click="openModalRestock(item.id)"> Restock </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="isModalRestockVisible" width="auto" persistent>
        <v-overlay :model-value="isValidatingSelectedInventory" class="align-center justify-center">
          <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        </v-overlay>
        <v-card width="800" prepend-icon="mdi-update">
          <form @submit.prevent="onSubmitRestock" novalidate>
            <v-card-title>Restock</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="stock.value.value"
                :error-messages="stock.errorMessage.value"
                dense
                placeholder="Stock"
                prepend-inner-icon="mdi-book"
                variant="outlined"
                type="number"
                label="Stock"
              />
              <v-radio-group
                inline
                v-model="action.value.value"
                :error-messages="action.errorMessage.value"
                label="Action"
              >
                <v-radio label="Increase" value="increase"></v-radio>
                <v-radio label="Decrease" value="decrease"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions class="tw-flex tw-justify-end">
              <v-btn color="blue" @click="closeModalRestock"> Cancel </v-btn>
              <v-btn color="green" type="submit"> submit </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-dialog>
    </div>
  </base-layout>
</template>
