import { Button } from "@/shared/components/Button";
import { ProfileField } from "./ProfileField";
import { AuthUser } from "@/shared/types/user";

export const ProfileView = ({ user, onEdit, onOpenModal }: {
  user: AuthUser;
  onEdit: () => void;
  onOpenModal: () => void;
}) => (
  <div className="space-y-6">
    <ProfileField label="Nombre" value={user.name} />
    <ProfileField label="Apellido" value={user.lastname} />
    <ProfileField label="Email" value={user.email} />
    
    <div className="flex space-x-4 pt-4">
      <Button variant="primary" onClick={onEdit}>
        Editar Perfil
      </Button>
      <Button variant="danger" onClick={onOpenModal}>
        Cerrar Cuenta
      </Button>
    </div>
  </div>
)