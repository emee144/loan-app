import React from 'react';
import { View, Text } from 'dripsy';
import { Ionicons } from '@expo/vector-icons';

const statusSteps = ['submitted', 'under_review', 'approved_or_rejected'];

const getStatusIcon = (status, currentStep) => {
  if (status === currentStep) {
    return <Ionicons name="time-outline" size={20} color="#fff" />;
  }
  if (
    (status === 'under_review' && currentStep === 'submitted') ||
    (status === 'approved' && currentStep !== 'rejected') ||
    (status === 'rejected' && currentStep !== 'approved')
  ) {
    return <Ionicons name="checkmark-done" size={20} color="#10b981" />;
  }
  return <Ionicons name="ellipse-outline" size={20} color="#ccc" />;
};

const getStepLabel = (step, actualStatus) => {
  switch (step) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'approved_or_rejected':
      return actualStatus === 'approved'
        ? 'Approved'
        : actualStatus === 'rejected'
        ? 'Rejected'
        : 'Waiting Decision';
    default:
      return '';
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default function LoanStatusTracker({ status, timestamps = {} }) {
  return (
    <View
      sx={{
        bg: 'white',
        borderRadius: 12,
        p: 12,
        mb: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text sx={{ color: 'green', fontWeight: 'bold', mb: 8 }}>
        Application Progress
      </Text>

      {statusSteps.map((step, index) => {
        const stepKey =
          step === 'approved_or_rejected'
            ? status === 'approved'
              ? 'approved'
              : status === 'rejected'
              ? 'rejected'
              : null
            : step;

        const timestamp = stepKey && timestamps[stepKey];

        return (
          <View
            key={index}
            sx={{
              flexDirection: 'column',
              mb: index !== statusSteps.length - 1 ? 12 : 0,
            }}
          >
            <View
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                sx={{
                  bg: '#10b981',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 12,
                }}
              >
                {getStatusIcon(status, step)}
              </View>
              <Text sx={{ fontSize: 16, color: 'black' }}>
                {getStepLabel(step, status)}
              </Text>
            </View>
            {timestamp && (
              <Text sx={{ fontSize: 12, color: 'gray', ml: 44, mt: 2 }}>
                updated {formatDate(timestamp)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}