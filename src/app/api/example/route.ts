import { NextRequest, NextResponse } from "next/server";

// Datos de ejemplo (en un caso real, esto vendría de una base de datos)
const mockData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Usuario ${i + 1}`,
    email: `usuario${i + 1}@ejemplo.com`,
    status: i % 2 === 0 ? "Activo" : "Inactivo",
}));

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Validaciones
    if (page < 1 || pageSize < 1) {
        return NextResponse.json(
            { error: "Página y tamaño de página deben ser mayores a 0" },
            { status: 400 }
        );
    }

    // Calcular índices para la paginación
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Obtener datos paginados
    const paginatedData = mockData.slice(startIndex, endIndex);

    // Calcular información de paginación
    const totalCount = mockData.length;
    const pageCount = Math.ceil(totalCount / pageSize);

    // Simular delay de red (opcional, para demostrar el estado de carga)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
        data: paginatedData,
        totalCount,
        pageCount,
        currentPage: page,
        pageSize,
    });
}
