<script setup lang="ts">
import BaseLayout from '../components/layouts/BaseLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import useSWRV from 'swrv';
import { masterBookService } from '../services/MasterBookService';
import { watch } from 'vue';
import { getErrorMessageAxios } from '../utils/function';

const router = useRouter();
const route = useRoute();

const id = route.params.id as string | undefined;

const {
  data: book,
  isValidating,
  mutate: reloadBook,
} = useSWRV(`/master-books/${id}`, async () => {
  return masterBookService.getBookById(id);
});
const { handleReset, handleSubmit } = useForm({
  validationSchema: {
    title: (value?: string) => {
      if (!value) {
        return 'Title is required';
      }

      return true;
    },
    publisher: (value?: string) => {
      if (!value) {
        return 'Publisher is required';
      }

      return true;
    },

    author: (value?: string) => {
      if (!value) {
        return 'Author is required';
      }

      return true;
    },

    year: (value?: string) => {
      if (!value) {
        return 'Year is required';
      }

      return true;
    },
  },
});

const title = useField('title');
const publisher = useField('publisher');
const author = useField('author');
const year = useField('year');

const onSubmit = handleSubmit(async (values) => {
  try {
    const bookId = book.value?.id;
    if (bookId) {
      await masterBookService.updateBook(`${bookId}`, values);
    } else {
      await masterBookService.createBook({
        title: values.title,
        publisher: values.publisher,
        author: values.author,
        year: values.year,
      });
    }
    console.log(values);
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

watch([book], () => {
  if (book.value) {
    title.value.value = book.value.title;
    publisher.value.value = book.value.publisher;
    author.value.value = book.value.author;
    year.value.value = book.value.year;
  }
});

watch([id], () => {
  reloadBook();
});
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <form novalidate @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col gap-4">
        <v-text-field
          v-model="title.value.value"
          :counter="50"
          :error-messages="title.errorMessage.value"
          label="Title"
        />

        <v-text-field
          v-model="publisher.value.value"
          :error-messages="publisher.errorMessage.value"
          label="Publisher"
        />
        <v-text-field v-model="author.value.value" :error-messages="author.errorMessage.value" label="Author" />
        <v-text-field v-model="year.value.value" :error-messages="year.errorMessage.value" label="Year" />
        <div class="tw-flex tw-justify-end tw-items-center tw-gap-4">
          <v-btn color="grey" @click="handleBack"> Back </v-btn>
          <v-btn color="green" type="submit"> submit </v-btn>
        </div>
      </div>
    </form>
  </base-layout>
</template>
