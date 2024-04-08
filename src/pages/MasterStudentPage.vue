<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import { useRouter } from 'vue-router';
import useSWRV from 'swrv';
import { masterStudentService } from '../services/MasterStudentService';
import { getErrorMessageAxios } from '../utils/function';

const router = useRouter();
const limit = ref(10);
const page = ref(1);
const qName = ref('');

const {
  data: masterStudents,
  isValidating,
  mutate: reloadMasterStudents,
} = useSWRV(`/master-students`, async () => {
  return masterStudentService.getAllStudents({
    limit: limit.value,
    page: page.value,
    name: qName.value,
  });
});

const handlingSearch = (value: string) => {
  qName.value = value;
};

const handleNew = () => {
  router.push('/master-student/new');
};

const handleEdit = (id: number) => {
  router.push(`/master-student/${id}`);
};

const handleDelete = async (id: number) => {
  try {
    await masterStudentService.deleteStudent(`${id}`);
    alert('Delete student success');
    reloadMasterStudents();
  } catch (error) {
    const message = getErrorMessageAxios(error);
    alert(message);
  }
};

// Listen to limit, page, and qName changes
watch([limit, page, qName], () => {
  reloadMasterStudents();
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
            <th>NAME</th>
            <th>NIM</th>
            <th>CREATED AT</th>
            <th>UPDATED AT</th>
            <th>KONTROL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in masterStudents?.data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.nim }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
            <td class="tw-flex tw-gap-2 tw-items-center" style="justify-content: center">
              <v-btn color="blue" small @click="handleEdit(item.id)"> Edit </v-btn>
              <v-btn color="red" small @click="handleDelete(item.id)"> Delete </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </base-layout>
</template>
