import { NextResponse } from 'next/server';

export function successResponse(data = null, pagination = null, status = 200) {
  const response = { success: true };
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(response, data);
  } else if (data) {
    response.data = data;
  }
  if (pagination) response.pagination = pagination;
  return NextResponse.json(response, { status });
}

export function errorResponse(message = 'An error occurred', status = 500, errorDetails = null) {
  const response = { success: false, error: message };
  if (errorDetails && process.env.NODE_ENV !== 'production') {
    response.details = errorDetails;
  }
  return NextResponse.json(response, { status });
}
