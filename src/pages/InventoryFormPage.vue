<script setup lang="ts">
import BaseLayout from '../components/layouts/BaseLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import useSWRV from 'swrv';
import { inventoryService } from '../services/InventoryService';
import { computed, watch } from 'vue';
import { getErrorMessageAxios } from '../utils/function';
import { masterBookService } from '../services/MasterBookService';

const router = useRouter();
const route = useRoute();
const id = route.params.id as string | undefined;

const {
  data: inventory,
  isValidating,
  mutate: reloadInventory,
} = useSWRV(`/inventory/${id}`, async () => {
  return inventoryService.getInventoryById(id);
});

const { data: masterBooks } = useSWRV(`/master-books`, async () => {
  return masterBookService.getAllBooks({
    limit: 100,
    page: 1,
  });
});

const { handleReset, handleSubmit } = useForm({
  initialValues: {
    book_id: undefined as number | undefined,
    location: '',
    stock: 0,
  },
  validationSchema: {
    book_id: (value?: number) => {
      if (!value) {
        return 'Book is required';
      }

      return true;
    },
    location: (value?: string) => {
      if (!value) {
        return 'Location is required';
      }

      return true;
    },
    stock: (value?: number) => {
      if (!value) {
        return 'Stock is required';
      }

      return true;
    },
  },
});

const book_id = useField('book_id');
const location = useField('location');
const stock = useField('stock');

const onSubmit = handleSubmit(async (values) => {
  try {
    console.log(values);

    const inventoryId = inventory.value?.id;
    if (inventoryId) {
      await inventoryService.updateInventory(`${inventoryId}`, {
        book_id: values.book_id,
        location: values.location,
        stock: values.stock,
      });
    } else {
      await inventoryService.createInventory({
        book_id: values.book_id!,
        location: values.location,
        stock: values.stock,
      });
    }

    handleReset();

    router.back();
  } catch (error) {
    const message = getErrorMessageAxios(error);
    alert(message);
  }
});

const handleBack = () => {
  router.back();
};

const mappingBook = computed(() => {
  return (
    masterBooks?.value?.data.map((book) => ({
      title: `${book.author} - ${book.title}`,
      value: `${book.id}`,
    })) ?? []
  );
});

watch(inventory, () => {
  if (inventory.value) {
    book_id.value.value = inventory.value.book_id;
    location.value.value = inventory.value.location;
    stock.value.value = inventory.value.stock;
  }
});

watch([id], () => {
  reloadInventory();
});
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <form novalidate @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col gap-4">
        <v-select
          clearable
          label="Select"
          v-model="book_id.value.value"
          :error-messages="book_id.errorMessage.value"
          :items="mappingBook"
          item-text="title"
          item-value="value"
        >
        </v-select>
        <v-text-field
          v-model="location.value.value"
          :error-messages="location.errorMessage.value"
          label="Location"
          dense
        />
        <v-text-field
          :disabled="inventory?.id !== undefined"
          type="number"
          v-model="stock.value.value"
          :error-messages="stock.errorMessage.value"
          label="Stock"
          dense
        />

        <div class="tw-flex tw-justify-end tw-items-center tw-gap-4">
          <v-btn color="grey" @click="handleBack"> Back </v-btn>
          <v-btn color="green" type="submit"> submit </v-btn>
        </div>
      </div>
    </form>
  </base-layout>
</template>
