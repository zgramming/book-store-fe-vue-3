<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import useSWRV from 'swrv';
import { transactionService } from '../services/TransactionService';
import { useField, useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { masterStudentService } from '../services/MasterStudentService';
import dayjs from 'dayjs';
import { inventoryService } from '../services/InventoryService';
import { getErrorMessageAxios } from '../utils/function';

interface SelectedItem {
  book_id: string;
  book_author: string;
  book_title: string;
  quantity: number;
}

const router = useRouter();
const route = useRoute();

const id = route.params.id as string | undefined;

const {
  data: transaction,
  isValidating,
  mutate: reloadTransaction,
} = useSWRV(`/transaction/${id}`, async () => {
  return transactionService.getTransactionById(id);
});

const { data: students } = useSWRV(`/students`, async () => {
  return masterStudentService.getAllStudents({
    limit: 100,
    page: 1,
  });
});

const { data: inventories } = useSWRV(`/inventories`, async () => {
  return inventoryService.getAllInventories({
    limit: 100,
    page: 1,
  });
});

const { handleSubmit } = useForm({
  initialValues: {
    student_id: transaction?.value?.student_id,
    date_loan: transaction?.value?.date_loan,
    date_return: transaction?.value?.date_return,
  },
  validationSchema: {
    student_id: (value?: number) => {
      if (!value) {
        return 'Student is required';
      }
      return true;
    },

    date_loan: (value?: Date) => {
      if (!value) {
        return 'Date Loan is required';
      }
      return true;
    },

    date_return: (value?: Date) => {
      if (!value) {
        return 'Date Return is required';
      }
      return true;
    },
  },
});

const selectedItems = ref<SelectedItem[]>([]);
const studentId = useField<number>('student_id');
const dateLoan = useField<string>('date_loan');
const dateReturn = useField<string>('date_return');
const durationLoan = useField('duration_loan');

const handleAddItem = (item: SelectedItem) => {
  const index = selectedItems.value.findIndex((selectedItem) => selectedItem.book_id === item.book_id);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value[index].quantity += 1;
  }
};

const handleRemoveItem = (item: SelectedItem) => {
  const index = selectedItems.value.findIndex((selectedItem) => selectedItem.book_id === item.book_id);
  if (index !== -1) {
    if (selectedItems.value[index].quantity > 1) {
      selectedItems.value[index].quantity -= 1;
    } else {
      selectedItems.value.splice(index, 1);
    }
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await transactionService.createTransaction({
      student_id: values.student_id!,
      date_loan: dayjs(values.date_loan).format('YYYY-MM-DD'),
      date_return: dayjs(values.date_return).format('YYYY-MM-DD'),
      items: selectedItems.value.map((item) => ({
        book_id: +item.book_id,
        quantity: item.quantity,
      })),
    });

    router.back();
  } catch (error) {
    console.error(error);
    const message = getErrorMessageAxios(error);
    alert(message);
  }
});

const handleBack = () => {
  router.back();
};

// Computed

const mappingStudent = computed(() => {
  return (
    students?.value?.data.map((student) => ({
      title: student.name,
      value: student.id,
    })) || []
  );
});

watch([id], () => {
  reloadTransaction();
});

// Calculate duration loan
watch(
  () => dateLoan.value.value && dateReturn.value.value,
  () => {
    const duration = dayjs(dateReturn.value.value).diff(dayjs(dateLoan.value.value), 'day');
    durationLoan.value.value = duration;
  },
);
</script>

<template>
  <base-layout>
    <v-overlay :model-value="isValidating" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <form novalidate @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col gap-4">
        <div class="tw-flex tw-justify-end tw-items-center tw-gap-4 mb-5">
          <v-btn color="grey" @click="handleBack"> Back </v-btn>
          <v-btn color="green" type="submit"> submit </v-btn>
        </div>
        <v-select
          clearable
          label="Student"
          v-model="studentId.value.value"
          :error-messages="studentId.errorMessage.value"
          :items="mappingStudent"
          item-text="title"
          item-value="value"
        >
        </v-select>
        <v-text-field
          type="date"
          prepend-inner-icon="mdi-calendar"
          v-model="dateLoan.value.value"
          :error-messages="dateLoan.errorMessage.value"
          label="Date Loan"
        />
        <v-text-field
          type="date"
          prepend-inner-icon="mdi-calendar"
          v-model="dateReturn.value.value"
          :error-messages="dateReturn.errorMessage.value"
          label="Date Return"
        />
        <v-text-field
          type="number"
          readonly
          v-model="durationLoan.value.value"
          :error-messages="durationLoan.errorMessage.value"
          label="Duration Loan (Days)"
        />
        <v-divider :thickness="2" class="border-opacity-100"></v-divider>
        <template class="tw-flex tw-items-start tw-w-full">
          <div class="tw-basis-2/3 tw-flex tw-flex-col tw-gap-4">
            <h4 class="mt-5">
              <strong> Available Books </strong>
            </h4>
            <v-table fixed-header>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>AUTHOR</th>
                  <th>BOOK</th>
                  <th>LOCATION</th>
                  <th>INITIAL STOCK</th>
                  <th>CURRENT STOCK</th>
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
                  <td>
                    <div class="tw-flex tw-gap-2 tw-items-center">
                      <v-btn
                        icon="mdi-minus"
                        density="compact"
                        color="red"
                        @click="
                          handleRemoveItem({
                            book_id: `${item.book.id}`,
                            book_author: item.book.author,
                            book_title: item.book.title,
                            quantity: 1,
                          })
                        "
                      >
                      </v-btn>
                      <v-btn
                        icon="mdi-plus"
                        density="compact"
                        color="green"
                        @click="
                          handleAddItem({
                            book_id: `${item.book.id}`,
                            book_author: item.book.author,
                            book_title: item.book.title,
                            quantity: 1,
                          })
                        "
                      >
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <v-card class="tw-basis-1/3 tw-flex tw-flex-col tw-gap-4 tw-m-5">
            <div class="tw-text-center tw-text-xl tw-py-5">SUMMARY TRANSACTION</div>
            <v-divider :thickness="2" class="border-opacity-100"></v-divider>
            <div v-for="(item, index) in selectedItems" :key="item.book_id">
              <v-card class="mx-5 my-5">
                <v-card-item>
                  <v-card-title>
                    <div class="tw-flex tw-justify-between">
                      <div>{{ `${index + 1}. ${item.book_title} - ${item.book_author}` }}</div>
                      <v-badge color="info" :content="`${item.quantity}x`" inline></v-badge>
                    </div>
                  </v-card-title>
                </v-card-item>
              </v-card>
            </div>
          </v-card>
        </template>
      </div>
    </form>
  </base-layout>
</template>
