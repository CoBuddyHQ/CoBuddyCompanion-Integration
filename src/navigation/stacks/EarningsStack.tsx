/**
 * CoBuddy Companion App - Earnings Stack (CPN-137 to CPN-150)
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {EarningsStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';
import {EarningsDashboardScreen} from '../../screens/earnings/EarningsDashboardScreen';
import {PayoutRequestScreen} from '../../screens/earnings/PayoutRequestScreen';
import {PayoutHistoryScreen} from '../../screens/earnings/PayoutHistoryScreen';
import {DailyEarningsBreakdownScreen} from '../../screens/earnings/DailyEarningsBreakdownScreen';
import {WeeklyMonthlyEarningsScreen} from '../../screens/earnings/WeeklyMonthlyEarningsScreen';
import {PendingEarningsScreen} from '../../screens/earnings/PendingEarningsScreen';
import {CompletedPayoutsScreen} from '../../screens/earnings/CompletedPayoutsScreen';
import {TransactionDetailScreen} from '../../screens/earnings/TransactionDetailScreen';
import {SupportCenterScreen} from '../../screens/support/SupportCenterScreen';
import {PayoutReviewScreen} from '../../screens/earnings/PayoutReviewScreen';
import {PayoutSuccessScreen} from '../../screens/earnings/PayoutSuccessScreen';
import {PayoutPendingScreen} from '../../screens/earnings/PayoutPendingScreen';
import {PayoutFailedScreen} from '../../screens/earnings/PayoutFailedScreen';
import {RefundPenaltyExplanationScreen} from '../../screens/earnings/RefundPenaltyExplanationScreen';
import {TaxInvoiceDetailsScreen} from '../../screens/earnings/TaxInvoiceDetailsScreen';
import {PolicyCenterScreen} from '../../screens/settings/PolicyCenterScreen';
import {CreateSupportTicketScreen} from '../../screens/support/CreateSupportTicketScreen';

const Stack = createStackNavigator<EarningsStackParamList>();

const EarningsStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name={Routes.EARNINGS_DASHBOARD} component={EarningsDashboardScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DAILY_EARNINGS_BREAKDOWN} component={DailyEarningsBreakdownScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.WEEKLY_MONTHLY_EARNINGS} component={WeeklyMonthlyEarningsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PENDING_EARNINGS} component={PendingEarningsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.COMPLETED_PAYOUTS} component={CompletedPayoutsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PAYOUT_REQUEST} component={PayoutRequestScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PAYOUT_REVIEW} component={PayoutReviewScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PAYOUT_SUCCESS} component={PayoutSuccessScreen} options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.PAYOUT_PENDING} component={PayoutPendingScreen} options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.PAYOUT_FAILED} component={PayoutFailedScreen} options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.REFUND_PENALTY_EXPLANATION} component={RefundPenaltyExplanationScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRANSACTION_HISTORY} component={PayoutHistoryScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRANSACTION_DETAIL} component={TransactionDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TAX_INVOICE_DETAILS} component={TaxInvoiceDetailsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SUPPORT_CENTER} component={SupportCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BANK_DETAILS} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.POLICY_CENTER} component={PolicyCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CREATE_SUPPORT_TICKET} component={CreateSupportTicketScreen} options={{headerShown: false}} />
  </Stack.Navigator>
);

export default EarningsStack;
