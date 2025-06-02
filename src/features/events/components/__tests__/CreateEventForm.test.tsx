import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import CreateEventForm from '../CreateEventForm';
import { createEvent } from '../../events.api';
import { uploadToCloudinary } from '../../../../shared/utils/uploadToCloudinary';
import axiosClient from '../../../../shared/lib/axiosClient';

// Mock de dependencias
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../events.api', () => ({
  createEvent: jest.fn(),
}));

jest.mock('../../../../shared/utils/uploadToCloudinary', () => ({
  uploadToCloudinary: jest.fn(),
}));

jest.mock('../../../../shared/lib/axiosClient', () => ({
  get: jest.fn(),
}));

// Tipos para los mocks
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockCreateEvent = createEvent as jest.MockedFunction<typeof createEvent>;
const mockUploadToCloudinary = uploadToCloudinary as jest.MockedFunction<typeof uploadToCloudinary>;
const mockAxiosClient = axiosClient as jest.Mocked<typeof axiosClient>;

describe('CreateEventForm', () => {
  const mockPush = jest.fn();
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test',
    lastname: 'User',
    isActive: true,
    roles: ['event-manager']
  };

  beforeEach(() => {
    // Reset de todos los mocks
    jest.clearAllMocks();
    
    // Setup del router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    // Setup del axios mock para autenticación exitosa
    mockAxiosClient.get.mockResolvedValue({
      data: mockUser
    });

    // Mock de File reader para las pruebas de imágenes
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,fake-image-data',
      onload: null as any,
    };
    
    (global as any).FileReader = jest.fn(() => mockFileReader);
    
    // Simular el onload del FileReader
    mockFileReader.readAsDataURL = jest.fn(function() {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,fake-image-data' } });
      }
    });
  });

  describe('Autenticación', () => {
    it('debe mostrar loading mientras verifica la autenticación', async () => {
    mockAxiosClient.get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CreateEventForm />);
    
    expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('debe redirigir a /unauthorized si el usuario no tiene rol de event-manager', async () => {
      const userWithoutRole = { ...mockUser, roles: ['user'] };
      mockAxiosClient.get.mockResolvedValue({ data: userWithoutRole });

      render(<CreateEventForm />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('debe redirigir a /login si la autenticación falla', async () => {
      mockAxiosClient.get.mockRejectedValue(new Error('Authentication failed'));

      render(<CreateEventForm />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('debe mostrar el formulario si la autenticación es exitosa', async () => {
      render(<CreateEventForm />);

      await waitFor(() => {
        expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre del evento *')).toBeInTheDocument();
      });
    });
  });

  describe('Formulario', () => {
    beforeEach(async () => {
      render(<CreateEventForm />);
      // Esperar a que pase la verificación de autenticación
      await waitFor(() => {
        expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
      });
    });

    it('debe renderizar todos los campos del formulario', () => {
      expect(screen.getByLabelText('Nombre del evento *')).toBeInTheDocument();
      expect(screen.getByText('Banner del evento *')).toBeInTheDocument();
      expect(screen.getByLabelText('Evento público')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Crear Evento' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });

    it('debe actualizar el estado cuando se cambia el nombre del evento', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('Nombre del evento *');
      
      await user.type(nameInput, 'Mi Evento de Prueba');
      
      expect(nameInput).toHaveValue('Mi Evento de Prueba');
    });

    it('debe actualizar el estado cuando se cambia la visibilidad', async () => {
      const user = userEvent.setup();
      const publicCheckbox = screen.getByLabelText('Evento público');
      
      expect(publicCheckbox).toBeChecked();
      
      await user.click(publicCheckbox);
      
      expect(publicCheckbox).not.toBeChecked();
    });

    it('debe redirigir al home cuando se hace click en cancelar', async () => {
      const user = userEvent.setup();
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      
      await user.click(cancelButton);
      
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Manejo de imágenes', () => {
    beforeEach(async () => {
      render(<CreateEventForm />);
      await waitFor(() => {
        expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
      });
    });

    it('debe validar el tipo de archivo', async () => {
    const user = userEvent.setup();
    const fileInput = screen.getByTestId('banner-file-input');

    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    await user.upload(fileInput, invalidFile);
    
    screen.debug(); // Imprime el DOM para depuración
    
    await waitFor(() => {
        expect(screen.getByText('Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)')).toBeInTheDocument();
    }, { timeout: 2000 });
    });

    it('debe validar el tamaño del archivo', async () => {
      const user = userEvent.setup();
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      // Crear un archivo de más de 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      await user.upload(fileInput, largeFile);
      
      await waitFor(() => {
        expect(screen.getByText('El archivo debe ser menor a 5MB')).toBeInTheDocument();
      });
    });

    it('debe mostrar preview cuando se selecciona una imagen válida', async () => {
      const user = userEvent.setup();
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      await user.upload(fileInput, validFile);
      
      await waitFor(() => {
        expect(screen.getByText('Imagen seleccionada:')).toBeInTheDocument();
        expect(screen.getByAltText('Preview de nueva imagen')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Usar esta imagen' })).toBeInTheDocument();
      });
    });

    it('debe subir la imagen a Cloudinary cuando se hace click en "Usar esta imagen"', async () => {
      const user = userEvent.setup();
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      mockUploadToCloudinary.mockResolvedValue('https://cloudinary.com/test-image.jpg');
      
      await user.upload(fileInput, validFile);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Usar esta imagen' })).toBeInTheDocument();
      });
      
      const uploadButton = screen.getByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      expect(mockUploadToCloudinary).toHaveBeenCalledWith(validFile);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Imagen lista para usar')).toBeInTheDocument();
      });
    });

    it('debe cancelar la selección de imagen', async () => {
    const user = userEvent.setup();
    const fileInput = screen.getByTestId('banner-file-input');
    
    const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, validFile);
    
    await waitFor(() => {
        expect(screen.getByText('Imagen seleccionada:')).toBeInTheDocument();
    });
    
    const imageCancelButton = screen.getByTestId('cancel-image-button');
    await user.click(imageCancelButton);
    
    await waitFor(() => {
        expect(screen.queryByText('Imagen seleccionada:')).not.toBeInTheDocument();
    });
    });

    it('debe mostrar error si falla la subida a Cloudinary', async () => {
      const user = userEvent.setup();
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      mockUploadToCloudinary.mockRejectedValue(new Error('Upload failed'));
      
      await user.upload(fileInput, validFile);
      
      const uploadButton = await screen.findByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
      });
    });
  });

  describe('Envío del formulario', () => {
    beforeEach(async () => {
      render(<CreateEventForm />);
      await waitFor(() => {
        expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si no hay nombre del evento', async () => {
    const user = userEvent.setup();
    const form = screen.getByRole('form');
    
    await fireEvent.submit(form);
    
    screen.debug(); // Imprime el DOM para depuración
    
    await waitFor(() => {
        expect(screen.getByText('El nombre del evento es obligatorio')).toBeInTheDocument();
    }, { timeout: 2000 });
    });

    it('debe mostrar error si no hay imagen del banner', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('Nombre del evento *');
      const submitButton = screen.getByRole('button', { name: 'Crear Evento' });
      
      await user.type(nameInput, 'Mi Evento');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Debes subir una imagen para el banner del evento')).toBeInTheDocument();
      });
    });

    /* it('debe crear el evento exitosamente', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('Nombre del evento *');
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      // Configurar mocks
      mockUploadToCloudinary.mockResolvedValue('https://cloudinary.com/test-image.jpg');
      mockCreateEvent.mockResolvedValue({
        id: '1',
        name: 'Mi Evento',
        bannerPhotoUrl: 'https://cloudinary.com/test-image.jpg',
        isPublic: true,
        user: mockUser
      });
      
      // Llenar formulario
      await user.type(nameInput, 'Mi Evento');
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      await user.upload(fileInput, validFile);
      
      const uploadButton = await screen.findByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      // Esperar que se suba la imagen
      await waitFor(() => {
        expect(screen.getByText('✓ Imagen lista para usar')).toBeInTheDocument();
      });
      
      // Enviar formulario
      const submitButton = screen.getByRole('button', { name: 'Crear Evento' });
      await user.click(submitButton);
      
      // Verificar llamada a la API
      expect(mockCreateEvent).toHaveBeenCalledWith(
        'Mi Evento',
        true,
        'https://cloudinary.com/test-image.jpg'
      );
      
      // Verificar mensaje de éxito
      await waitFor(() => {
        expect(screen.getByText('¡Evento creado exitosamente!')).toBeInTheDocument();
      });
    }); */

    it('debe mostrar error si falla la creación del evento', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('Nombre del evento *');
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      // Configurar mocks
      mockUploadToCloudinary.mockResolvedValue('https://cloudinary.com/test-image.jpg');
      mockCreateEvent.mockResolvedValue({ error: 'Error al crear evento' });
      
      // Llenar formulario
      await user.type(nameInput, 'Mi Evento');
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, validFile);
      
      const uploadButton = await screen.findByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Imagen lista para usar')).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Evento' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error al crear evento')).toBeInTheDocument();
      });
    });

    it('debe deshabilitar botones durante la carga', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('Nombre del evento *');
      const fileInput = document.getElementById('bannerFile') as HTMLInputElement;
      
      // Configurar mocks para que tomen tiempo
      mockUploadToCloudinary.mockResolvedValue('https://cloudinary.com/test-image.jpg');
      mockCreateEvent.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      // Llenar formulario
      await user.type(nameInput, 'Mi Evento');
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, validFile);
      
      const uploadButton = await screen.findByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Imagen lista para usar')).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Evento' });
      await user.click(submitButton);
      
      // Verificar que los botones están deshabilitados
      expect(screen.getByRole('button', { name: 'Creando evento...' })).toBeDisabled();
      expect(screen.getAllByRole('button', { name: 'Cancelar' })[0]).toBeDisabled(); // El botón del formulario
    });
  });

  /* escribe('Estados de pantalla completa', () => {
    it('debe mostrar pantalla de éxito y redirigir', async () => {
      // Configurar el componente para mostrar éxito directamente
      const user = userEvent.setup();
      
      // Renderizar y configurar para éxito
      render(<CreateEventForm />);
      
      await waitFor(() => {
        expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
      });
      
      const nameInput = screen.getByLabelText('Nombre del evento *');
      const fileInput = screen.getByLabelText(/Banner del evento/);
      
      mockUploadToCloudinary.mockResolvedValue('https://cloudinary.com/test-image.jpg');
      mockCreateEvent.mockResolvedValue({
        id: '1',
        name: 'Mi Evento',
        bannerPhotoUrl: 'https://cloudinary.com/test-image.jpg',
        isPublic: true,
        user: mockUser
      });
      
      await user.type(nameInput, 'Mi Evento');
      
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, validFile);
      
      const uploadButton = await screen.findByRole('button', { name: 'Usar esta imagen' });
      await user.click(uploadButton);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Imagen lista para usar')).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Evento' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('¡Evento creado exitosamente!')).toBeInTheDocument();
        expect(screen.getByText('Redirigiendo a la página principal...')).toBeInTheDocument();
      });
      
      // Verificar que se programa la redirección
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      }, { timeout: 2500 });
    });
  }); */
});