import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Récupérer le token du header Authorization
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    // Vérifier le format du token (Bearer)
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Format de token invalide');
    }

    try {
      // Ici, vous devriez vérifier le token
      // Pour l'instant, nous faisons une vérification minimale
      if (!token) {
        throw new UnauthorizedException('Token invalide');
      }

      // Vous pouvez ajouter votre logique de vérification de token ici
      // Par exemple, vérifier avec votre service d'authentification

      // Attacher des informations de l'utilisateur à la requête
      request.user = {
        id: 'user_id', // Remplacer par l'ID réel de l'utilisateur
        token: token,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentification échouée');
    }
  }
}
