
'use server';

import { updateApplicationAction } from './applicationActions';
import type { UserApplication } from '@/lib/types';


export async function updateCAServiceApplicationAction(applicationId: string, data: any) {
    // This is a wrapper to call the generic update action with the correct category.
    // The main action is now smart enough to handle the raw form data.
    return updateApplicationAction(applicationId, 'caService' as UserApplication['serviceCategory'], data);
}
