import { Component, OnInit } from '@angular/core';
import { JwtPersistenceService } from 'src/app/auth/services/jwt-persistence.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private jwtPersistence: JwtPersistenceService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((profileQueryResult) => {
      if (profileQueryResult.error) {
        this.jwtPersistence.clear();
      }

      console.log({ profileQueryResult });
    });
  }
}
