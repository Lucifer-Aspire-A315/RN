
'use server';

import { updateApplicationAction } from './applicationActions';
import type { UserApplication } from '@/lib/types';

export async function updateGovernmentSchemeLoanApplicationAction(applicationId: string, data: any) {
    // This is a wrapper to call the generic update action with the correct category.
    return updateApplicationAction(applicationId, 'governmentScheme' as UserApplication['serviceCategory'], { formData: data });
}
