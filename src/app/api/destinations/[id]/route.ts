import {
  handleGetDestinationById,
  handleUpdateDestination,
  handleDeleteDestination,
} from "@/app/modules/destination/destination.route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleGetDestinationById(id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleUpdateDestination(id, request);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleDeleteDestination(id);
}
