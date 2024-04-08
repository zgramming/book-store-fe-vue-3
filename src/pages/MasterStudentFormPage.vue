<script setup lang="ts">
import BaseLayout from '../components/layouts/BaseLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import useSWRV from 'swrv';
import { masterStudentService } from '../services/MasterStudentService';
import { watch } from 'vue';
import { getErrorMessageAxios } from '../utils/function';

const router = useRouter();
const route = useRoute();
const id = route.params.id as string | undefined;

const {
  data: student,
  isValidating,
  mutate: reloadStudent,
} = useSWRV(`/master-students/${id}`, async () => {
  return masterStudentService.getStudentById(id);
});

const { handleReset, handleSubmit } = useForm({
  initialValues: {
    name: '',
    nim: '',
    status: 'active',
  },
  validationSchema: {
    name: (value?: string) => {
      if (!value) {
        return 'Name is required';
      }

      return true;
    },

    nim: (value?: string) => {
      if (!value) {
        return 'NIM is required';
      }

      return true;
    },
    status: (value?: string) => {
      if (!value) {
        return 'Status is required';
      }

      return true;
    },
  },
});

const name = useField('name');
const nim = useField('nim');
const status = useField('status');

const onSubmit = handleSubmit(async (values) => {
  try {
    const studentId = student.value?.id;
    if (studentId) {
      await masterStudentService.updateStudent(`${studentId}`, {
        name: values.name,
        nim: values.nim,
        status: values.status,
      });
    } else {
      await masterStudentService.createStudent({
        name: values.name,
        nim: values.nim,
        status: values.status,
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

watch([student], () => {
  if (student.value) {
    name.value.value = student.value.name;
    nim.value.value = student.value.nim;
    status.value.value = student.value.status;
  }
});

watch([id], () => {
  reloadStudent();
});
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <form novalidate @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col gap-4">
        <v-text-field v-model="name.value.value" :error-messages="name.errorMessage.value" label="Name" dense />
        <v-text-field v-model="nim.value.value" :error-messages="nim.errorMessage.value" label="NIM" dense />
        <v-radio-group
          v-model="status.value.value"
          :error-messages="status.errorMessage.value"
          label="Status"
          dense
          inline
        >
          <v-radio label="Active" value="active"></v-radio>
          <v-radio label="Inactive" value="inactive"></v-radio>
        </v-radio-group>
        <div class="tw-flex tw-justify-end tw-items-center tw-gap-4">
          <v-btn color="grey" @click="handleBack"> Back </v-btn>
          <v-btn color="green" type="submit"> submit </v-btn>
        </div>
      </div>
    </form>
  </base-layout>
</template>
