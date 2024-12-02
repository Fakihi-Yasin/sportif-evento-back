import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service'; // Import your user service

@Injectable()  // function li katppassi lina wahd meta data lclass
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

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
      // Décoder et vérifier le token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // Trouver l'utilisateur dans la base de données
      const user = await this.usersService.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      // Attacher l'utilisateur à la requête
      request.user = user;
      console.log(request.user);

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expiré');
      }
      throw new UnauthorizedException('Authentification échouée');
    }
  }
}
